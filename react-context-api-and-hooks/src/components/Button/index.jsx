export const Button = ({ children, onButtonClick, disabled=false }) => {
    return (
        <button disabled={disabled} style={{fontSize: '60px'}} onClick={onButtonClick}>{ children }</button>
    )
}