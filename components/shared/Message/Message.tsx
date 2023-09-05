import style from "./Message.module.css"

function BubbleTail ()
{
    return (
    <div className={style.msgBubble__triangle} ></div>
    )
}


function MessageBubble() {
    return (
    <div className={`${style.msgBubble__match_width_to_text} ${style.middlePosition}`}>Hello world!</div>
    ); // Use the class name directly
  }
  

export default function Message ()
{
    return (
        <div >
            <MessageBubble/>
            <BubbleTail/>
                
        </div>
    );
}
