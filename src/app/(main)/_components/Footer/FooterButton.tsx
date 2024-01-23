import My from '@/@core/components/Button';

export default function FooterButton(props: My.ButtonProps) {
  return (
    <My.Button className="footer-button" style={props.selected ? {color: 'white'} : undefined} {...props}>
      <div className="icon">{props.icon}</div>
      <span className="title">{props.title}</span>
    </My.Button>
  );
}