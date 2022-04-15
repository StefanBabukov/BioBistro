<div>
<div className="Navbar">
    <div className="leftSide">
        <div className="links" id={showLinks ? "hidden" : ""}>
            <a href="/home">Home</a>
            <a href="/activities">Activities</a>
            <a href="/profile">Profile</a>
            {showAdmin}
        </div>
        
        <button onClick={() => setShowLinks(!showLinks)}>
            <ReorderIcon />
        </button>
    </div>
    <div className="rightSide">
        <a href="/profile" className="profilePage">
            <img src={basicUserImage} alt="user" />
            <span
                style={{
                    position: "relative",
                    color: "black",
                    left: "81%",
                    bottom: "15%",
                    "font-weight": "bold",
                    "font-size": "130%",
                }}
                id="username"
            >
                {`${state.firstname} ${state.surname}`}
            </span>
        </a>
        <Button
            id="logoutButton"
            size="small"
            shape="round"
            icon={<LogoutOutlined />}
            onClick={logout}
        >
            Log out
        </Button>
    </div>
</div>
</div>