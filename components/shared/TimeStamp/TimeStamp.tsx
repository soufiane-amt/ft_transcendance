import style from './TimeStamp.module.css'

function TimeStamp({ time }) {
    return (
      <div
        className={`${style.time_stamp} ${style.time_stamp__font_size} ${style.time_stamp__color_gray}`}
      >
        {time}
      </div>
    );
  }

export default TimeStamp;