import React from "react";


export default function Unauthorized(){
    const styles = {
        img : {
            width : '100vw',
            Height : 'auto',
            overflow : 'hidden'
        }
    };
    
    return(
        <div>
            <a>
                <img 
                style={styles.img} 
                src={'../static/frontend/public/media/403.jpg'} />  
                
            </a>
        </div>
    )
}
