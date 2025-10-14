import '../styles/NavBar.css';

function NavBar({setPage, goToWork}) {
    return ((
        <div className='nav-bar'>
          <button className='nav-bar-button' onClick={() => setPage("about")} style={{"font-weight": "bold"}}>Quenton Ni</button>
          <button className='nav-bar-button' onClick={() =>setPage("experience")}>Projects</button>
          <button className='nav-bar-button' onClick={ ()=>{setPage("work"); goToWork();}}>Work</button>
          <button className='nav-bar-button' onClick={()=>setPage("contact")}>Contact Me</button>
      </div>
    ))
}
export default NavBar;