import glamorous from 'glamorous';

const overrideProps = props => ({ ...props, children: undefined, theme: undefined });

export default glamorous.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}, overrideProps);
