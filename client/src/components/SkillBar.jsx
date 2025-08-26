export default function SkillBar({ name, level = 0 }) {
  return (
    <div style={{margin:'6px 0'}}>
      <div style={{display:'flex', justifyContent:'space-between'}}>
        <strong>{name}</strong><span>{level}%</span>
      </div>
      <div style={{height:8, background:'#eee', borderRadius:4}}>
        <div style={{width:`${level}%`, height:8}} />
      </div>
    </div>
  );
}
