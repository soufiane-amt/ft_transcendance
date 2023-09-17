import style from './TimeStamp.module.css'


function TimeStamp({ time }:{time: string|undefined}) {

  //If message is sent then give it now time*/
    return (
      <div
        className={`${style.time_stamp} ${style.time_stamp__font_size} ${style.time_stamp__color_gray}`}
      >
        {time}
      </div>
    );
  }

export default TimeStamp;