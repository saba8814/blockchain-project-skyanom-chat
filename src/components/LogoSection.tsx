import React from 'react'
import SkyLogotip from "../assets/skylogotip.jpg";
import AnomLogotip from "../assets/anomlogotip.jpg";

const LogoSection = () => {
  return (
    <div className="logo-section">
        <img src={SkyLogotip} className="sky-logo logo"/>
        <img src={AnomLogotip} className="anom-logo logo" />
    </div>
  )
}

export default LogoSection