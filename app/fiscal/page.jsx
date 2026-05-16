import Link from "next/link"
export default function Page() {
  return (
    <div style={{minHeight:"100vh",background:"var(--navy)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:"24px",padding:"120px 40px 60px",textAlign:"center"}}>
      <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:"14px",letterSpacing:".2em",textTransform:"uppercase",color:"var(--gold)"}}>Próximamente</div>
      <h1 style={{fontFamily:"Cormorant Garamond,serif",fontSize:"clamp(36px,5vw,60px)",fontWeight:300,color:"white",lineHeight:1.1}}>Página en construcción</h1>
      <p style={{fontSize:"15px",fontWeight:300,color:"rgba(255,255,255,.6)",maxWidth:"480px"}}>Esta sección está siendo preparada. Mientras tanto, puedes contactarnos directamente.</p>
      <div style={{display:"flex",gap:"16px",flexWrap:"wrap",justifyContent:"center"}}>
        <Link href="/contacto" className="btn-gold">Consulta gratuita</Link>
        <Link href="/" className="btn-ghost">Volver al inicio</Link>
      </div>
    </div>
  )
}
