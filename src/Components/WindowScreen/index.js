import React from 'react'
import {motion} from 'framer-motion'
function WindowScreen({children,isHidden,setIsHidden,constraintsRef}) {
  
    const [maximize,setMaximize] = React.useState(false);
    const maximizeWindow = ()=> {
        setMaximize(!maximize);
    }
    const onClose = ()=> {
        setIsHidden(!isHidden);
    }
    return (
          <motion.div drag dragMomentum={false}>
          <div className={`window-custom ${maximize ? "full" : ''} ${!isHidden ?'hide':'show'}`}>
            <div className="title-bar">
              <div className="title-bar-text">A Window With Stuff In It</div>
              <div className="title-bar-controls">
                <button aria-label="Minimize"></button>
                <button aria-label={`${maximize ? "Restore" : 'Maximize'}`} onClick={maximizeWindow}></button>
                <button aria-label="Close" onClick={onClose}></button>
              </div>
            </div>
            <div className={`window-body-custom ${maximize ? "full" : ''}`}>
                {children}
            </div>
          </div>
        </motion.div>
    )
}

export default WindowScreen
