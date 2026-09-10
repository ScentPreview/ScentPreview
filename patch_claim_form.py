import re

with open("src/App.tsx", "r") as f:
    content = f.read()

# Replace state initialization inside ClaimFormModal
old_form_state = """  const [buyerName, setBuyerName] = useState("");
  const [email, setEmail] = useState("");
  const [perfumeSize, setPerfumeSize] = useState("");
  const [imageProof, setImageProof] = useState("");"""

new_form_state = """  const [buyerName, setBuyerName] = useState("");
  const [email, setEmail] = useState("");
  const [perfumeAndSize, setPerfumeAndSize] = useState("");
  const [proofImage, setProofImage] = useState("");"""

content = content.replace(old_form_state, new_form_state)

# Replace handleSubmit
old_submit = """  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !email || !perfumeSize) {
      alert("Please fill out all required fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerName, email, perfumeSize, imageProof })
      });
      
      // Clear form
      setBuyerName("");
      setEmail("");
      setPerfumeSize("");
      setImageProof("");"""

new_submit = """  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !email || !perfumeAndSize) {
      alert("Please fill out all required fields.");
      return;
    }
    setIsSubmitting(true);
    try {
      await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerName, email, perfumeAndSize, proofImage })
      });
      
      // Clear form
      setBuyerName("");
      setEmail("");
      setPerfumeAndSize("");
      setProofImage("");"""

content = content.replace(old_submit, new_submit)

# Replace references in JSX
content = content.replace("value={perfumeSize}", "value={perfumeAndSize}")
content = content.replace("onChange={e => setPerfumeSize(e.target.value)}", "onChange={e => setPerfumeAndSize(e.target.value)}")
content = content.replace('setImageProof(reader.result as string);', 'setProofImage(reader.result as string);')
content = content.replace('imageProof ? "IMAGE ATTACHED', 'proofImage ? "IMAGE ATTACHED')
content = content.replace('{imageProof && (', '{proofImage && (')
content = content.replace('src={imageProof}', 'src={proofImage}')

with open("src/App.tsx", "w") as f:
    f.write(content)
