import { useEffect, useRef } from "react";

export function  useOutsideClick (close:(parm:boolean)=>void)
{
const ref = useRef<any>(null)
useEffect(

        () => {
            const handleClick = (event: any) => {
                if (!ref.current) return;
                if(!ref.current.contains(event.target))
                    close (false)
            }

            document.addEventListener('click', handleClick)
    
            return (

                () => document.removeEventListener('click', handleClick)
            )
        },
        []
      )
        return ref;
    }