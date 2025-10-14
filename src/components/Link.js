import '../styles/Link.css';
function Link({linkaddr, img, name, dark}) {
    return (
        <div className='link-container'>
          <a className='link' href={linkaddr} target="_blank" rel="noreferrer">  
            <img src={img} style={dark ? {height:'20px', filter: "invert(100%)"} : {height: '20px'}} alt=''/>
          {name}
          </a>
      </div>
    )
}

export default Link