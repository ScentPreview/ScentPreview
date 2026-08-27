import express from "express";
import rateLimit from "express-rate-limit";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import fs from "fs";
import jwt from "jsonwebtoken";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

dotenv.config();

interface Order {
  orderNumber: string;
  items: { name: string; size: string; quantity: number }[];
  total: number;
  name: string;
  email: string;
  address: string;
  phone: string;
  state?: string;
  pincode?: string;
  shippingProtection: boolean;
  status: "pending" | "paid" | "deleted";
  createdAt: Date;
  stockReduced?: boolean;
}

const ORDERS_FILE_PATH = path.join(process.cwd(), "orders.json");
const BACKUP_ORDERS_FILE_PATH = path.join(process.cwd(), "orders.backup.json");

let ordersDb: Order[] = [];

// Helper to load orders from disk with backup fallback
function loadOrdersFromDisk(): Order[] {
  try {
    // 1. Try reading the main orders file
    if (fs.existsSync(ORDERS_FILE_PATH)) {
      const data = fs.readFileSync(ORDERS_FILE_PATH, "utf-8").trim();
      if (data) {
        try {
          const parsed = JSON.parse(data);
          if (Array.isArray(parsed)) {
            // Synchronize backup file to be identical
            try {
              fs.writeFileSync(BACKUP_ORDERS_FILE_PATH, data, "utf-8");
            } catch (backupErr) {
              console.error("[Database Backup Error] Failed to write backup file:", backupErr);
            }
            return parsed;
          }
        } catch (parseError) {
          console.error("[Database Error] Main orders.json is corrupted or invalid. Attempting recovery...", parseError);
        }
      }
    }
    
    // 2. If main file is missing or corrupt, try loading from the backup file
    if (fs.existsSync(BACKUP_ORDERS_FILE_PATH)) {
      const backupData = fs.readFileSync(BACKUP_ORDERS_FILE_PATH, "utf-8").trim();
      if (backupData) {
        try {
          const parsed = JSON.parse(backupData);
          if (Array.isArray(parsed)) {
            console.log("[Database Recovery] Successfully recovered orders from backup file!");
            // Restore the main file with backup content
            fs.writeFileSync(ORDERS_FILE_PATH, backupData, "utf-8");
            return parsed;
          }
        } catch (backupParseError) {
          console.error("[Database Error] Backup file is also corrupted or invalid:", backupParseError);
        }
      }
    }
    
    // 3. If neither exists or both are empty, initialize empty file only if not existing
    if (!fs.existsSync(ORDERS_FILE_PATH)) {
      fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify([], null, 2), "utf-8");
    }
  } catch (error) {
    console.error("[Database Error] Fatal exception loading orders from disk:", error);
  }
  return [];
}

// Helper to save orders to disk with dual-write redundancy
function saveOrdersToDisk() {
  try {
    const dataStr = JSON.stringify(ordersDb, null, 2);
    // Write to main file
    fs.writeFileSync(ORDERS_FILE_PATH, dataStr, "utf-8");
    // Write to backup file
    fs.writeFileSync(BACKUP_ORDERS_FILE_PATH, dataStr, "utf-8");
    console.log(`[Database] Persisted ${ordersDb.length} orders to disk and backup.`);
  } catch (error) {
    console.error("[Database Error] Failed to save orders to disk or backup:", error);
  }
}

// Initialize the database from disk
ordersDb = loadOrdersFromDisk();

// Initialize Client Firestore
let firestoreDb: any = null;
try {
  const firebaseConfig = {
    projectId: "gen-lang-client-0828448722",
    appId: "1:299548177856:web:06c09064fe94d9d8f20425",
    apiKey: "AIzaSyCpCSp5q0ji7gVPpjOgYKbK3d5c2tw5I88",
    authDomain: "gen-lang-client-0828448722.firebaseapp.com"
  };
  const app = initializeApp(firebaseConfig);
  firestoreDb = getFirestore(app, "ai-studio-scentpreview-cdb09123-f70a-4cac-ade2-943e5e95115c");
  console.log("[Firebase] Successfully initialized Client Firestore with Database ID: ai-studio-scentpreview-cdb09123-f70a-4cac-ade2-943e5e95115c");
} catch (error) {
  console.error("[Firebase Error] Failed to initialize Client Firestore:", error);
}

// Helper to fetch all orders from Firestore (migrating local orders if Firestore is empty)
async function fetchAllOrdersFromFirestore(): Promise<Order[]> {
  if (!firestoreDb) {
    return loadOrdersFromDisk();
  }
  try {
    const snapshot = await getDocs(collection(firestoreDb, "orders"));
    const orders: Order[] = [];
    snapshot.forEach((d: any) => {
      const data = d.data();
      if (data.createdAt) {
        data.createdAt = new Date(data.createdAt);
      }
      orders.push(data as Order);
    });
    
    // Merge Firestore orders with any local orders on disk to ensure absolute persistence
    const localOrders = loadOrdersFromDisk();
    const mergedMap = new Map();
    
    // 1. Add local orders first
    localOrders.forEach(o => {
      if (o && o.orderNumber) {
        mergedMap.set(o.orderNumber, o);
      }
    });
    
    // 2. Overwrite/add with Firestore orders (Firestore is the source of truth)
    orders.forEach(o => {
      if (o && o.orderNumber) {
        mergedMap.set(o.orderNumber, o);
      }
    });
    
    const finalOrders = Array.from(mergedMap.values()) as Order[];

    // Sort final orders by createdAt descending
    finalOrders.sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });

    // If Firestore is empty, seed it with the current local orders
    if (orders.length === 0 && finalOrders.length > 0) {
      console.log(`[Firebase Seeding] Seeding ${finalOrders.length} local orders to Firestore...`);
      for (const order of finalOrders) {
        await saveOrderToFirestore(order);
      }
    }

    // Cache local files for extra safety and speed
    try {
      fs.writeFileSync(ORDERS_FILE_PATH, JSON.stringify(finalOrders, null, 2), "utf-8");
      fs.writeFileSync(BACKUP_ORDERS_FILE_PATH, JSON.stringify(finalOrders, null, 2), "utf-8");
    } catch (fsErr) {
      console.error("[Database Backup Error] Failed to write fallback file:", fsErr);
    }

    return finalOrders;
  } catch (error) {
    console.error("[Firebase Error] Failed to fetch orders from Firestore. Falling back to disk:", error);
    return loadOrdersFromDisk();
  }
}

// Helper to save a single order to Firestore
async function saveOrderToFirestore(order: Order) {
  if (!firestoreDb) {
    return;
  }
  try {
    const dataToSave = {
      ...order,
      createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt
    };
    await setDoc(doc(firestoreDb, "orders", order.orderNumber), dataToSave);
    console.log(`[Firebase] Successfully saved order ${order.orderNumber} to Firestore.`);
  } catch (error) {
    console.error(`[Firebase Error] Failed to save order ${order.orderNumber} to Firestore:`, error);
  }
}

// Helper to load stock levels from Firestore (with automatic seeding and local backup caching)
async function loadStockFromFirestore(): Promise<StockDB> {
  if (!firestoreDb) {
    return loadStockFromDisk();
  }
  try {
    const docSnap = await getDoc(doc(firestoreDb, "stock", "current"));
    if (docSnap.exists()) {
      const stock = docSnap.data() as StockDB;
      if (stock && stock.fragrances && stock.fragrances["lattafa-khamrah"] && stock.fragrances["lattafa-khamrah"]["10ml"] === 10) {
        console.log("[Stock] Old Firestore database detected. Overwriting with official user stock list...");
        await saveStockToFirestore(DEFAULT_STOCK);
        return DEFAULT_STOCK;
      }
      
      // Cache to disk
      try {
        fs.writeFileSync(STOCK_FILE_PATH, JSON.stringify(stock, null, 2), "utf-8");
      } catch (err) {}
      
      return stock;
    } else {
      console.log("[Firebase] Seeding Stock collection in Firestore from local backup...");
      const diskStock = loadStockFromDisk();
      await saveStockToFirestore(diskStock);
      return diskStock;
    }
  } catch (error) {
    console.error("[Firebase Error] Failed to load stock from Firestore. Falling back to disk:", error);
    return loadStockFromDisk();
  }
}

// Helper to save stock levels to Firestore
async function saveStockToFirestore(stock: StockDB) {
  saveStockToDisk(stock);
  if (!firestoreDb) {
    return;
  }
  try {
    await setDoc(doc(firestoreDb, "stock", "current"), stock);
    console.log("[Firebase] Successfully saved stock levels to Firestore.");
  } catch (error) {
    console.error("[Firebase Error] Failed to save stock to Firestore:", error);
  }
}

const STOCK_FILE_PATH = path.join(process.cwd(), "stock.json");

interface StockDB {
  fragrances: Record<string, Record<string, number>>;
  bundles: Record<string, number>;
}

const DEFAULT_STOCK: StockDB = {
  fragrances: {
    "la-uno-qaswa": { "10ml": 1, "5ml Normal": 11, "5ml HQ": 2 },
    "ck-one": { "10ml": 2, "5ml Normal": 8, "5ml HQ": 3 },
    "zara-for-him-black": { "10ml": 1, "5ml Normal": 5, "5ml HQ": 0 },
    "givenchy-gentleman": { "10ml": 1, "5ml Normal": 12, "5ml HQ": 0 },
    "zara-intense-dark": { "10ml": 1, "5ml Normal": 5, "5ml HQ": 0 },
    "zara-rich-warm-addictive": { "10ml": 0, "5ml Normal": 16, "5ml HQ": 0 },
    "lattafa-khamrah": { "10ml": 0, "5ml Normal": 13, "5ml HQ": 0 },
    "zara-sunrise": { "10ml": 2, "5ml Normal": 0, "5ml HQ": 0 },
    "zara-seoul-winter": { "10ml": 1, "5ml Normal": 0, "5ml HQ": 1 },
    "zara-seoul": { "10ml": 0, "5ml Normal": 0, "5ml HQ": 2 },
    "ck2": { "10ml": 1, "5ml Normal": 0, "5ml HQ": 0 }
  },
  bundles: {
    "spotlight-arabian": 5,
    "bundle-day-night": 0,
    "bundle-marine-core": 0,
    "bundle-rare-collector": 0,
    "bundle-office-rotation": 0,
    "bundle-cozy-winter": 0,
    "bundle-master-vault": 0,
    "bundle-zara-classics": 0
  }
};

function loadStockFromDisk(): StockDB {
  try {
    if (fs.existsSync(STOCK_FILE_PATH)) {
      const data = fs.readFileSync(STOCK_FILE_PATH, "utf-8");
      const stock = JSON.parse(data);
      // If the stock contains old placeholder levels (e.g. lattafa-khamrah has 10ml stock which is now 0 in the official list),
      // we auto-upgrade/overwrite it to the user's official list to make sure it matches their real stock.
      if (stock && stock.fragrances && stock.fragrances["lattafa-khamrah"] && stock.fragrances["lattafa-khamrah"]["10ml"] === 10) {
        console.log("[Stock] Old database detected. Overwriting with official user stock list...");
        fs.writeFileSync(STOCK_FILE_PATH, JSON.stringify(DEFAULT_STOCK, null, 2), "utf-8");
        return DEFAULT_STOCK;
      }
      return stock;
    } else {
      fs.writeFileSync(STOCK_FILE_PATH, JSON.stringify(DEFAULT_STOCK, null, 2), "utf-8");
      return DEFAULT_STOCK;
    }
  } catch (error) {
    console.error("[Stock Error] Failed to load stock from disk:", error);
    return DEFAULT_STOCK;
  }
}

function saveStockToDisk(stock: StockDB) {
  try {
    fs.writeFileSync(STOCK_FILE_PATH, JSON.stringify(stock, null, 2), "utf-8");
    console.log(`[Stock] Saved updated stock to disk.`);
  } catch (error) {
    console.error("[Stock Error] Failed to save stock to disk:", error);
  }
}

function findItemIdByName(name: string): { type: "fragrance" | "bundle"; id: string } | null {
  const norm = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  
  const fragrances = [
    { id: "lattafa-khamrah", names: ["lattafakhamrah", "khamrah", "lattafa"] },
    { id: "zara-sunrise", names: ["zarasunrise", "sunrise", "sunriseontheredsanddunes", "redsanddunes", "sanddunes"] },
    { id: "zara-for-him-black", names: ["zaraforhimblack", "forhimblack", "himblack"] },
    { id: "zara-intense-dark", names: ["zaraintensedark", "intensedark", "intensivedark", "intense", "intensive"] },
    { id: "zara-seoul-winter", names: ["zaraseoulwinter", "seoulwinter"] },
    { id: "la-uno-qaswa", names: ["launoqaswa", "qaswa", "launo", "uno"] },
    { id: "ck-one", names: ["calvinkleinckone", "ckone", "one", "ck1"] },
    { id: "ck2", names: ["calvinkleinck2", "ck2"] },
    { id: "zara-rich-warm-addictive", names: ["zararichwarmaddictive", "richwarmaddictive", "richwarm"] },
    { id: "zara-seoul", names: ["zaraseoul", "seoul", "seouloriginal", "originalseoul"] },
    { id: "givenchy-gentleman", names: ["givenchygentleman", "gentleman", "givenchy"] }
  ];

  const bundles = [
    { id: "spotlight-arabian", names: ["arabianexotictreasuresduo", "spotlightarabian", "arabianexotic", "exotictreasures"] },
    { id: "bundle-day-night", names: ["thedaytonightsignatureduo", "bundledaynight", "daytonight"] },
    { id: "bundle-marine-core", names: ["thehypercleanmarinecorekit", "bundlemarinecore", "marinecore"] },
    { id: "bundle-rare-collector", names: ["rarediscontinuedcollectorduo", "bundlerarecollector", "rarediscontinued"] },
    { id: "bundle-office-rotation", names: ["247officeboardroomrotation", "bundleofficerotation", "officerotation"] },
    { id: "bundle-cozy-winter", names: ["thecozywintergourmandtrio", "bundlecozywinter", "cozywinter"] },
    { id: "bundle-master-vault", names: ["ultimatemasterlayeringvault", "bundlemastervault", "masterlayering", "mastervault"] },
    { id: "bundle-zara-classics", names: ["thezaraonlycultclassicsquad", "bundlezaraclassics", "zaraonly"] }
  ];

  for (const f of fragrances) {
    if (f.id === norm || f.names.some(n => norm.includes(n) || n.includes(norm))) {
      return { type: "fragrance", id: f.id };
    }
  }

  for (const b of bundles) {
    if (b.id === norm || b.names.some(n => norm.includes(n) || n.includes(norm))) {
      return { type: "bundle", id: b.id };
    }
  }

  return null;
}

function getBundleConstituents(bundleId: string): string[] {
  switch (bundleId) {
    case "spotlight-arabian":
      return ["lattafa-khamrah", "la-uno-qaswa"];
    case "bundle-day-night":
      return ["zara-sunrise", "zara-for-him-black"];
    case "bundle-marine-core":
      return ["ck-one"];
    case "bundle-rare-collector":
      return ["ck2", "zara-intense-dark"];
    case "bundle-office-rotation":
      return ["givenchy-gentleman", "ck-one"];
    case "bundle-cozy-winter":
      return ["zara-seoul-winter"];
    case "bundle-master-vault":
      return ["lattafa-khamrah"];
    case "bundle-zara-classics":
      return ["zara-sunrise", "zara-seoul-winter"];
    default:
      return [];
  }
}

async function reduceStockForItems(items: { name: string; size: string; quantity: number }[]) {
  try {
    const stock = await loadStockFromFirestore();
    for (const item of items) {
      const match = findItemIdByName(item.name);
      if (match) {
        if (match.type === "fragrance") {
          const fStock = stock.fragrances[match.id];
          if (fStock) {
            const current = fStock[item.size] || 0;
            fStock[item.size] = Math.max(0, current - item.quantity);
            console.log(`[Stock] Reduced fragrance ${match.id} (${item.size}) by ${item.quantity}. Remaining: ${fStock[item.size]}`);
          }
        } else {
          // Reduce the bundle stock level
          const current = stock.bundles[match.id] || 0;
          stock.bundles[match.id] = Math.max(0, current - item.quantity);
          console.log(`[Stock] Reduced bundle ${match.id} by ${item.quantity}. Remaining: ${stock.bundles[match.id]}`);

          // Also reduce the individual constituent perfumes from main stock
          const constituentFragranceIds = getBundleConstituents(match.id);
          for (const fragId of constituentFragranceIds) {
            const fStock = stock.fragrances[fragId];
            if (fStock) {
              const sizeToReduce = item.size || "5ml Normal";
              const curFragStock = fStock[sizeToReduce] || 0;
              fStock[sizeToReduce] = Math.max(0, curFragStock - item.quantity);
              console.log(`[Stock] Reduced constituent fragrance ${fragId} (${sizeToReduce}) by ${item.quantity} due to bundle ${match.id}. Remaining: ${fStock[sizeToReduce]}`);
            }
          }
        }
      } else {
        console.warn(`[Stock] Could not match item name: "${item.name}" for stock reduction.`);
      }
    }
    await saveStockToFirestore(stock);
  } catch (err) {
    console.error("[Stock Error] Failed to reduce stock:", err);
  }
}

async function restoreStockForItems(items: { name: string; size: string; quantity: number }[]) {
  try {
    const stock = await loadStockFromFirestore();
    for (const item of items) {
      const match = findItemIdByName(item.name);
      if (match) {
        if (match.type === "fragrance") {
          const fStock = stock.fragrances[match.id];
          if (fStock) {
            const current = fStock[item.size] || 0;
            fStock[item.size] = current + item.quantity;
            console.log(`[Stock] Restored fragrance ${match.id} (${item.size}) by ${item.quantity}. New level: ${fStock[item.size]}`);
          }
        } else {
          // Restore the bundle stock level
          const current = stock.bundles[match.id] || 0;
          stock.bundles[match.id] = current + item.quantity;
          console.log(`[Stock] Restored bundle ${match.id} by ${item.quantity}. New level: ${stock.bundles[match.id]}`);

          // Also restore the individual constituent perfumes from main stock
          const constituentFragranceIds = getBundleConstituents(match.id);
          for (const fragId of constituentFragranceIds) {
            const fStock = stock.fragrances[fragId];
            if (fStock) {
              const sizeToRestore = item.size || "5ml Normal";
              const curFragStock = fStock[sizeToRestore] || 0;
              fStock[sizeToRestore] = curFragStock + item.quantity;
              console.log(`[Stock] Restored constituent fragrance ${fragId} (${sizeToRestore}) by ${item.quantity} due to bundle ${match.id}. New level: ${fStock[sizeToRestore]}`);
            }
          }
        }
      } else {
        console.warn(`[Stock] Could not match item name: "${item.name}" for stock restoration.`);
      }
    }
    await saveStockToFirestore(stock);
  } catch (err) {
    console.error("[Stock Error] Failed to restore stock:", err);
  }
}

async function sendNotificationEmail(order: Order) {
  const itemsList = order.items
    .map((item: any) => `${item.name} (${item.size}) x${item.quantity}`)
    .join(", ");

  const shippingProtectionText = order.shippingProtection ? "Yes" : "No";

  const emailSubject = "New Perfume Order Received!";
  const emailHtml = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff; color: #1c1917;">
      <h2 style="color: #cda869; border-bottom: 2px solid #cda869; padding-bottom: 10px; font-family: serif; font-style: italic; margin-top: 0;">ScentPreview Order Notification</h2>
      <p style="font-size: 14px; line-height: 1.5; color: #44403c;">Hello,</p>
      <p style="font-size: 14px; line-height: 1.5; color: #44403c;">A new payment has been successfully confirmed and processed via the payment protocol webhook. Here are the order details:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14px;">
        <tr>
          <td style="padding: 10px 8px; border-bottom: 1px solid #e7e5e4; font-weight: bold; width: 180px; color: #44403c;">Order Number:</td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #e7e5e4; color: #1c1917; font-family: monospace;">${order.orderNumber}</td>
        </tr>
        <tr>
          <td style="padding: 10px 8px; border-bottom: 1px solid #e7e5e4; font-weight: bold; color: #44403c;">Perfume Variant(s):</td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #e7e5e4; color: #b45309; font-weight: 600;">${itemsList}</td>
        </tr>
        <tr>
          <td style="padding: 10px 8px; border-bottom: 1px solid #e7e5e4; font-weight: bold; color: #44403c;">Customer Name:</td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #e7e5e4; color: #1c1917;">${order.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 8px; border-bottom: 1px solid #e7e5e4; font-weight: bold; color: #44403c;">Shipping Address:</td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #e7e5e4; color: #1c1917; line-height: 1.4;">
            ${order.address}<br>
            ${order.state || ""}${order.pincode ? ` - ${order.pincode}` : ""}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 8px; border-bottom: 1px solid #e7e5e4; font-weight: bold; color: #44403c;">Contact Phone:</td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #e7e5e4; color: #1c1917;">${order.phone || "N/A"}</td>
        </tr>
        <tr>
          <td style="padding: 10px 8px; border-bottom: 1px solid #e7e5e4; font-weight: bold; color: #44403c;">Shipping Protection:</td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #e7e5e4; font-weight: ${order.shippingProtection ? 'bold' : 'normal'}; color: ${order.shippingProtection ? '#059669' : '#78716c'};">
            ${shippingProtectionText}
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 8px; border-bottom: 1px solid #e7e5e4; font-weight: bold; color: #44403c;">Total Amount Paid:</td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #e7e5e4; font-weight: bold; font-size: 16px; color: #059669;">₹${order.total}.00</td>
        </tr>
      </table>
      
      <p style="font-size: 11px; color: #78716c; border-top: 1px solid #e7e5e4; padding-top: 15px; margin-top: 30px; line-height: 1.4;">
        This automated notification was generated by ScentPreview because order status was updated to 'paid' via webhook.
      </p>
    </div>
  `;

  const emailText = `
New Perfume Order Received!

Order Number: ${order.orderNumber}
Perfume Variant: ${itemsList}
Customer Name: ${order.name}
Customer Address: ${order.address}, ${order.state || ""} ${order.pincode || ""}
Shipping Protection: ${shippingProtectionText}
Total Amount Paid: ₹${order.total}.00
  `;

  const recipient = "scentpreview@gmail.com";

  // Try Resend first if key is present
  if (process.env.RESEND_API_KEY) {
    try {
      console.log("[Email Service] Attempting to send email via Resend...");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "ScentPreview <onboarding@resend.dev>",
        to: recipient,
        subject: emailSubject,
        html: emailHtml,
        text: emailText,
      });
      console.log(`[Email Service] Email successfully sent via Resend to ${recipient}`);
      return { success: true, service: "resend" };
    } catch (err) {
      console.error("[Email Service] Failed to send email using Resend:", err);
    }
  }

  // Try Nodemailer if SMTP options are present
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    try {
      console.log("[Email Service] Attempting to send email via Nodemailer...");
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `ScentPreview <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: recipient,
        subject: emailSubject,
        text: emailText,
        html: emailHtml,
      });
      console.log(`[Email Service] Email successfully sent via Nodemailer to ${recipient}`);
      return { success: true, service: "nodemailer" };
    } catch (err) {
      console.error("[Email Service] Failed to send email using Nodemailer:", err);
    }
  }

  // Fallback console log for simulation
  console.log("\n==================================================");
  console.log("             NEW PERFUME ORDER RECEIVED!          ");
  console.log("==================================================");
  console.log(`To:      ${recipient}`);
  console.log(`Subject: ${emailSubject}`);
  console.log("--------------------------------------------------");
  console.log(`Perfume Variant(s):  ${itemsList}`);
  console.log(`Customer Name:       ${order.name}`);
  console.log(`Shipping Address:    ${order.address}, ${order.state || ""} ${order.pincode || ""}`);
  console.log(`Shipping Protection: ${shippingProtectionText}`);
  console.log(`Total Amount Paid:   ₹${order.total}.00`);
  console.log("==================================================\n");
  return { success: false, service: "log-only" };
}

async function startServer() {
  const app = express();
  
  // Trust proxy is required for express-rate-limit to properly identify IPs when running behind a reverse proxy (like in AI Studio/Cloud Run)
  app.set("trust proxy", 1);
  
  const PORT = 3000;

  app.use(express.json());

  // Rate Limiting for Admin Login to prevent brute force attacks
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per `window` to avoid locking out the user in preview
    message: { error: "Too many login attempts from this IP, please try again after 15 minutes" },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });



  // Load initial orders and stock from Firestore on startup
  try {
    console.log("[Startup] Initializing cache from Firestore...");
    ordersDb = await fetchAllOrdersFromFirestore();
    console.log(`[Startup] Loaded ${ordersDb.length} orders from database.`);
    const currentStock = await loadStockFromFirestore();
    console.log("[Startup] Successfully cached current stock level");
  } catch (startupErr) {
    console.error("[Startup Error] Failed to prime cache from Firestore:", startupErr);
    ordersDb = loadOrdersFromDisk();
  }

  // Initialize Gemini client if API key is present
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;

  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  } else {
    console.warn("GEMINI_API_KEY is not defined in environment variables. Scent Lab will run in mock mode.");
  }

  // API Route: Evaluate Fragrance Layering
  app.post("/api/layering-feedback", async (req, res) => {
    try {
      const { scents } = req.body;

      if (!scents || !Array.isArray(scents) || scents.length === 0) {
        return res.status(400).json({ error: "No scents provided for layering." });
      }

      const scentNames = scents.map((s) => s.name).join(" and ");
      const scentDetails = scents
        .map((s) => `- ${s.name} (${s.brand}) with notes: ${s.notes}`)
        .join("\n");

      if (!ai) {
        // Mock response if no API key is available
        const score = scents.length === 1 ? 75 : Math.floor(Math.random() * 21) + 80; // 80-100 for blends
        const mockResponse = {
          comboName: `${scents.map(s => s.name.split(' ').slice(-1)[0]).join(' ')} Alchemy`,
          scentProfile: `An intriguing blend combining the core elements of ${scentNames}. The juxtaposition of notes creates a modern, layered aura.`,
          harmonyScore: score,
          sillage: scents.length > 1 ? "Enveloping" : "Moderate",
          bestSeason: "All Seasons",
          vibeDescription: "Sophisticated and exploratory. An individualistic statement that feels highly personal and distinct.",
          isMock: true,
        };
        return res.json(mockResponse);
      }

      const prompt = `You are an elite, world-renowned creative director and master olfactory designer for ultra-luxury perfume houses like Loro Piana, Creed, and Hermès.
Analyze the sensory synergy and olfactory profile of combining the following fragrances:
${scentDetails}

Construct a highly evocative, poetic, and professional analysis of this combination. Avoid generic marketing jargon or "AI slop" telemetry. Speak with the deep elegance, sensory knowledge, and authority of a classical French master perfumer.

Your evaluation must fit this schema:
- comboName: A luxury, artistic name for this specific layered blend (e.g., "Incense & Velvet Amber" or "Mineral Iris Contrast").
- scentProfile: A 2-3 sentence highly evocative, vivid description of how these exact ingredients and notes react, contrast, and fuse together on the skin.
- harmonyScore: An integer (1 to 100) representing how well these scent notes harmonize. Think carefully about notes that contrast beautifully vs. notes that clash.
- sillage: A brief scale representation (e.g., "Intimate", "Moderate Whispers", "Enveloping Aura", "Magnificent Projection").
- bestSeason: The perfect climate or specific setting for this blend (e.g., "Crisp Autumn Nights", "Monsoon Afternoons", "Gilded Winter Galas").
- vibeDescription: A poetic, single-sentence summary of the psychological mood and character of the person wearing this combination.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.8,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              comboName: {
                type: Type.STRING,
                description: "A prestigious, artistic title for the layered combination.",
              },
              scentProfile: {
                type: Type.STRING,
                description: "Vivid description of how notes react and fuse on the skin.",
              },
              harmonyScore: {
                type: Type.INTEGER,
                description: "Olfactory compatibility rating from 1 to 100.",
              },
              sillage: {
                type: Type.STRING,
                description: "Projection and trail scale description.",
              },
              bestSeason: {
                type: Type.STRING,
                description: "The ideal environment or season.",
              },
              vibeDescription: {
                type: Type.STRING,
                description: "The mood and persona statement.",
              },
            },
            required: ["comboName", "scentProfile", "harmonyScore", "sillage", "bestSeason", "vibeDescription"],
          },
        },
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response received from Gemini API.");
      }

      const parsedFeedback = JSON.parse(responseText.trim());
      res.json(parsedFeedback);
    } catch (error: any) {
      console.error("Error in layering evaluation endpoint:", error);
      res.status(500).json({ error: "Failed to generate fragrance profile. Please try again." });
    }
  });

  // API Route: Get current stock data
  app.get("/api/stock", async (req, res) => {
    try {
      const stock = await loadStockFromFirestore();
      res.json({ success: true, stock });
    } catch (error) {
      console.error("Error fetching stock:", error);
      res.status(500).json({ error: "Failed to fetch stock data" });
    }
  });





  // Middleware to authenticate admin requests via JWT
  const authenticateAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Access denied. No token provided." });
      }

      const token = authHeader.split(" ")[1];
      const jwtSecret = process.env.JWT_SECRET || "scentpreview_fallback_secret_key_2026";
      
      try {
        const decoded = jwt.verify(token, jwtSecret);
        (req as any).admin = decoded;
        next();
      } catch (err) {
        return res.status(403).json({ error: "Access denied. Invalid or expired token." });
      }
    } catch (error) {
      console.error("Auth middleware error:", error);
      res.status(500).json({ error: "Internal server authentication error." });
    }
  };
  app.post("/api/stock/reset", authenticateAdmin, async (req, res) => {
    try {
      await saveStockToFirestore(DEFAULT_STOCK);
      res.json({ success: true, message: "Stock successfully reset to the official list", stock: DEFAULT_STOCK });
    } catch (error) {
      console.error("Error resetting stock:", error);
      res.status(500).json({ error: "Failed to reset stock data" });
    }
  });

  // API Route: Update stock levels directly (manual management in Admin portal)
  app.post("/api/stock", authenticateAdmin, async (req, res) => {
    try {
      const { fragrances, bundles } = req.body;
      if (!fragrances || !bundles) {
        return res.status(400).json({ error: "Invalid stock update request payload." });
      }
      
      const updatedStock: StockDB = { fragrances, bundles };
      await saveStockToFirestore(updatedStock);
      res.json({ success: true, message: "Stock levels successfully updated", stock: updatedStock });
    } catch (error) {
      console.error("Error updating stock levels:", error);
      res.status(500).json({ error: "Failed to update stock levels" });
    }
  });

  // API Route: Create order (Pending state)
  app.post("/api/orders", async (req, res) => {
    try {
      const { items, total, orderNumber, name, email, address, phone, state, pincode, shippingProtection, skipStockReduction } = req.body;

      if (!orderNumber || !items || !name || !address) {
        return res.status(400).json({ error: "Missing required checkout fields." });
      }

      // Check if order already exists in cache or reload from Firestore
      let existingOrder = ordersDb.find(o => o.orderNumber === orderNumber);
      if (!existingOrder && firestoreDb) {
        try {
          const docSnap = await getDoc(doc(firestoreDb, "orders", orderNumber));
          if (docSnap.exists()) {
            existingOrder = docSnap.data() as Order;
            if (existingOrder && existingOrder.createdAt) {
              existingOrder.createdAt = new Date(existingOrder.createdAt);
            }
            if (existingOrder) {
              ordersDb.push(existingOrder);
            }
          }
        } catch (dbErr) {
          console.warn(`[Database Lookup Warning] Failed to fetch order ${orderNumber} during creation pre-check:`, dbErr);
        }
      }

      if (existingOrder) {
        return res.json({ success: true, order: existingOrder });
      }

      const newOrder: Order = {
        orderNumber,
        items,
        total,
        name,
        email,
        address,
        phone,
        state,
        pincode,
        shippingProtection: !!shippingProtection,
        status: "pending",
        createdAt: new Date(),
        stockReduced: false,
      };

      // Validate stock before creating order unless skipped
      if (Array.isArray(items) && !skipStockReduction) {
        const stock = await loadStockFromFirestore();
        for (const item of items) {
          const match = findItemIdByName(item.name);
          if (match) {
            if (match.type === "fragrance") {
              const fStock = stock.fragrances[match.id];
              if (fStock) {
                const current = fStock[item.size] || 0;
                if (current < item.quantity) {
                  return res.status(400).json({ error: `Insufficient stock for ${item.name} (${item.size}).` });
                }
              }
            } else {
              const current = stock.bundles[match.id] || 0;
              if (current < item.quantity) {
                return res.status(400).json({ error: `Insufficient stock for bundle ${item.name}.` });
              }
              const constituentFragranceIds = getBundleConstituents(match.id);
              for (const fragId of constituentFragranceIds) {
                const fStock = stock.fragrances[fragId];
                if (fStock) {
                  const sizeToReduce = item.size || "5ml Normal";
                  const curFragStock = fStock[sizeToReduce] || 0;
                  if (curFragStock < item.quantity) {
                    return res.status(400).json({ error: `Insufficient stock for constituent ${fragId} in bundle ${item.name}.` });
                  }
                }
              }
            }
          }
        }
      }

      // Reduce the stock of items by the requested quantities unless skipped
      if (Array.isArray(items) && !skipStockReduction) {
        await reduceStockForItems(items);
        newOrder.stockReduced = true;
      }

      ordersDb.push(newOrder);
      saveOrdersToDisk();
      await saveOrderToFirestore(newOrder);

      console.log(`[Database] Created pending order: ${orderNumber} for ${name}`);
      res.status(201).json({ success: true, order: newOrder });
    } catch (error: any) {
      console.error("Error creating order:", error);
      res.status(500).json({ error: "Failed to create order on server." });
    }
  });

  // API Route: Webhook receiver to handle updates from payment providers
  app.post("/api/webhooks/payment", async (req, res) => {
    try {
      const { orderNumber, status, transactionId } = req.body;
      console.log(`[Webhook] Received payment update. Order: ${orderNumber}, Status: ${status}, Transaction: ${transactionId}`);

      if (!orderNumber || !status) {
        return res.status(400).json({ error: "Missing orderNumber or status." });
      }

      let order = ordersDb.find((o) => o.orderNumber === orderNumber);
      if (!order && firestoreDb) {
        // Query Firestore first if cache is cold
        const docSnap = await getDoc(doc(firestoreDb, "orders", orderNumber));
        if (docSnap.exists()) {
          order = docSnap.data() as Order;
          if (order.createdAt) {
            order.createdAt = new Date(order.createdAt);
          }
          ordersDb.push(order);
        }
      }

      if (!order) {
        console.warn(`[Webhook Warning] Order ${orderNumber} not found in database. Preparing fallback autoconfirm...`);
        return res.status(404).json({ error: `Order ${orderNumber} not found in database.` });
      }

      if (status === "paid") {
        order.status = "paid";

        // Reduce stock if not reduced yet
        if (!order.stockReduced && Array.isArray(order.items)) {
          await reduceStockForItems(order.items);
          order.stockReduced = true;
        }

        saveOrdersToDisk();
        await saveOrderToFirestore(order);
        console.log(`[Webhook Success] Order ${orderNumber} status updated to 'paid' in Firestore. Dispatching email...`);
        const emailResult = await sendNotificationEmail(order);
        return res.json({
          success: true,
          message: `Order marked as paid. Email notification dispatched.`,
          emailService: emailResult.service,
        });
      }

      res.json({ success: true, message: `Webhook processed. Status is: ${status}` });
    } catch (error: any) {
      console.error("Error in webhook handler:", error);
      res.status(500).json({ error: "Webhook handling failed." });
    }
  });

  // API Route: Confirm Payment and trigger Webhook flow from client
  app.post("/api/orders/confirm-payment", async (req, res) => {
    try {
      const { orderNumber } = req.body;
      if (!orderNumber) {
        return res.status(400).json({ error: "Missing orderNumber in confirmation request." });
      }

      console.log(`[Confirm Payment Request] User confirming payment for: ${orderNumber}. Triggering payment flow...`);

      let order = ordersDb.find((o) => o.orderNumber === orderNumber);
      if (!order && firestoreDb) {
        // Try getting from Firestore first
        const docSnap = await getDoc(doc(firestoreDb, "orders", orderNumber));
        if (docSnap.exists()) {
          order = docSnap.data() as Order;
          if (order.createdAt) {
            order.createdAt = new Date(order.createdAt);
          }
          ordersDb.push(order);
        }
      }
      
      // If order is still missing, create it dynamically to be highly fault-tolerant
      if (!order) {
        order = {
          orderNumber,
          items: req.body.items || [],
          total: req.body.total || 0,
          name: req.body.name || "Valued Patron",
          email: req.body.email || "",
          address: req.body.address || "",
          phone: req.body.phone || "",
          state: req.body.state,
          pincode: req.body.pincode,
          shippingProtection: !!req.body.shippingProtection,
          status: "pending",
          createdAt: new Date(),
          stockReduced: false,
        };
        ordersDb.push(order);
        console.log(`[Database Autocreate] Created pending order ${orderNumber} on confirmation.`);
      }

      // Simulate state transition to 'paid' as would happen via webhook
      order.status = "paid";

      // If stock has not been reduced yet, we reduce it now!
      const skipStockReduction = !!req.body.skipStockReduction;
      if (!order.stockReduced && Array.isArray(order.items) && !skipStockReduction) {
        await reduceStockForItems(order.items);
        order.stockReduced = true;
      }

      saveOrdersToDisk();
      await saveOrderToFirestore(order);
      console.log(`[Payment Confirmed] Dispatching order email for ${orderNumber}...`);
      const emailResult = await sendNotificationEmail(order);

      res.json({
        success: true,
        orderStatus: order.status,
        emailService: emailResult.service,
      });
    } catch (error: any) {
      console.error("Error confirming payment:", error);
      res.status(500).json({ error: "Failed to process payment confirmation." });
    }
  });

  // API Route: Admin Login (Generates JWT)
  app.post("/api/login", loginLimiter, (req, res) => {
    try {
      const { passcode } = req.body;
      const expectedPasscode = "gephelbuiltallofthisforagirl";

      if (passcode !== expectedPasscode) {
        return res.status(401).json({ error: "Invalid passcode." });
      }

      const jwtSecret = process.env.JWT_SECRET || "scentpreview_fallback_secret_key_2026";

      // Generate token valid for 2 hours
      const token = jwt.sign({ role: "admin" }, jwtSecret, { expiresIn: "2h" });
      res.json({ success: true, token });
    } catch (error: any) {
      console.error("Login error:", error);
      res.status(500).json({ error: "An error occurred during login." });
    }
  });

  // API Route: Get all orders (for Admin Zone) - Protected
  app.get("/api/orders", authenticateAdmin, async (req, res) => {
    try {
      const orders = await fetchAllOrdersFromFirestore();
      ordersDb = orders; // Sync local in-memory cache
      res.json({ success: true, orders });
    } catch (error: any) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Failed to fetch orders." });
    }
  });

  // API Route: Delete an order by orderNumber (for Admin Zone) - Protected
  app.delete("/api/orders/:orderNumber", authenticateAdmin, async (req, res) => {
    try {
      const { orderNumber } = req.params;
      
      // Look up in cache or reload from Firestore
      let orderToDelete = ordersDb.find(o => o.orderNumber === orderNumber);
      if (!orderToDelete && firestoreDb) {
        const docSnap = await getDoc(doc(firestoreDb, "orders", orderNumber));
        if (docSnap.exists()) {
          orderToDelete = docSnap.data() as Order;
          if (orderToDelete.createdAt) {
            orderToDelete.createdAt = new Date(orderToDelete.createdAt);
          }
          ordersDb.push(orderToDelete);
        }
      }

      if (!orderToDelete) {
        return res.status(404).json({ error: "Order not found." });
      }
      
      // If the order was paid/pending and items reduced stock, restore them!
      if (orderToDelete.stockReduced && orderToDelete.items && orderToDelete.items.length > 0) {
        console.log(`[Stock Restoration] Restoring stock for order ${orderNumber} items:`, orderToDelete.items);
        await restoreStockForItems(orderToDelete.items);
      }

      // Instead of splicing and completely deleting, we tombstone the order with status: "deleted"
      // to synchronize the deletion across all distributed client browser backups.
      orderToDelete.status = "deleted";
      saveOrdersToDisk();
      await saveOrderToFirestore(orderToDelete);
      res.json({ success: true, message: `Order ${orderNumber} deleted successfully. Stock has been restored.` });
    } catch (error: any) {
      console.error("Error deleting order:", error);
      res.status(500).json({ error: "Failed to delete order." });
    }
  });

  // Vite Integration & Static File Serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
