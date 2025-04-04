import React from 'react'
import "./gui.css"

export default function Gui() {
  return (
    <div className='gui' style={{zIndex: 1000}}>
      <form >
      <div className="mode">
      Mode:
        <input type="radio" name="Mode" value="Encryption" />
       <label htmlFor="Encryption">Encryption</label>
        <input type="radio" name="Mode"  value="Decryption"/>
        <label htmlFor="Decryption">Decryption</label><br />
      </div>
      cipher:
        <select name="Cipher" >
            <option value="Caesar">caesar Cipher</option>
            <option value="Monoalphabetic">Monoalphabetic Cipher</option>
            <option value="Railfence">Railfence Cipher</option>
            <option value="Columnar">Columnar Cipher</option>
            <option value="Doublecolumnar">Doublecolumnar Cipher</option>
            <option value="Hill">Hill Cipher</option>
            <option value="Vignere">Vignere Cipher</option>
            <option value="Vernam">Vernam Cipher</option>
            <option value="Autokey">Autokey Cipher</option>
            <option value="Playfair">Playfair Cipher</option>
            <option value="Fiestel">Fiestel Cipher</option>
            <option value="AES">AES</option>
            <option value="DES">DES</option>            
        </select><br />
       
        Message: <textarea rows={5} cols={100} name="textbox" className='gui-textarea' /><br />
        key: <input type="password" name="key" /><br />
        
      </form>
    </div>
  )
}