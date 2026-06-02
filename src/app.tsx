"use client"
import './index.css';
import { createRoot } from 'react-dom/client';
import {useState, useEffect} from 'react'
const root = createRoot(document.body);
root.render(<Sterling />);
function Sterling() {

    const [openGame, setOpenGame] = useState<boolean>(false)


    const [modifyDeckWindow, setModifyDeckWindow] = useState<boolean>(false);

    const [defaultAutoFormat, toggleDefaultAutoFormat] = useState<boolean>(false)

    const getDefaultAutoFormat = async () => {
        const {success, data} = await (window as any).electronAPI.getDefaultAutoFormat()
        
        if(success && data.autoformat) {
            toggleDefaultAutoFormat(true)
            setAutoFormat(true)
        }
        else if(success && !data.autoformat) {
            toggleDefaultAutoFormat(false)
            setAutoFormat(false)
        }
        else {
            setErrorMsg("There was an error getting the default autoformat value")
        }
    }
    const setDefaultAutoFormat = async (bool: boolean) => {
        const {success} = await (window as any).electronAPI.setDefaultAutoFormat(bool)
        if(success) {
            getDefaultAutoFormat()
        }
        else {
            setErrorMsg("There was an error setting the default autoformat value")
        }
    }

    const triggerHelpAutoFormat = () => {

    }

    const [addDeckMsg, setAddDeckMsg] = useState<any[]>([false, ""])

    const [openCardField, setOpenCardField] = useState<boolean>(false)

    const [deckStage, setDeckStage] = useState<number>(0);
    const progressDeck = () => {
        setDeckStage(deckStage + 1)
    }
    const [autoFormat, setAutoFormat] = useState<boolean>(true)

    const [cardFront, setCardFront] = useState<string>("")
    const [cardBack, setCardBack] = useState<string>("")

    const [explorerKey, setExplorerKey] = useState<number>(0)
    const addACard = async (deckId: string, front:string, back:string) => {

        if(autoFormat) {
            
            let tempFront = ""
            let tempBack = ""
            //Capital letter check

            //normal whitespace check

            //period or question mark

            let frontSplit = front.split(" ")
            let backSplit = back.split(" ")

            function fun(a: string[], e: string) {
                if (!a.includes(e)) return a
                return a.filter((item) => item !== e)
            }
            frontSplit = fun(frontSplit, '')
            backSplit = fun(backSplit, '')

            for(let a = 0; a < frontSplit.length; a++) {
                tempFront += `${frontSplit[a]} `
            }
            for(let b = 0; b < backSplit.length; b++) {
                tempBack += `${backSplit[b]} `
            }
            
            let capFront = tempFront.charAt(0).toUpperCase()
            let slicedFront = tempFront.slice(1, tempFront.length - 1)
            tempFront = capFront + slicedFront

            let capBack = tempBack.charAt(0).toUpperCase()
            let slicedBack = tempBack.slice(1, tempBack.length - 1)
            tempBack = capBack + slicedBack


            if(!tempFront.endsWith('.') || !tempFront.endsWith('?')) {
                tempFront += "."
            }
            if(!tempBack.endsWith('.') || !tempBack.endsWith('?')) {
                tempBack += "."
            }
            


            front = tempFront
            back = tempBack

        }  

        const {success} = await (window as any).electronAPI.addCard(deckId, front, back)
        

        setCardFront("")
        setCardBack("")

        if(success) {
            setAddDeckMsg([true, "Card Added"])
        }
        else {
            setAddDeckMsg([false, "Could Not Add Card"])
        }
        getDecksFile()

        getCardsFromDeck(explorerKey)

    }


    const [renameTopicField, setRenameTopicField] = useState<number>(0);
    const [renameTopicName, setRenameTopicName] = useState<string>("");


    const [cardsFromDeck, setCardsFromDeck] = useState<any>(null)

    const getCardsFromDeck = async (key: number) => {
        const {success, data} = await (window as any).electronAPI.getCardsFromDeck(key)
        if(success == false) {
            setErrorMsg("There was an error getting the cards from a deck.")
        }
        else {
            setCardsFromDeck(data)
        }
    }

    const renameADeck = async (key: number, rename: string) => {
        console.log(key, rename)
        const {success} = await (window as any).electronAPI.renameDeck(key, rename)
        if(success == false) {
            setErrorMsg("There was an error renaming a topic.")
        }
        getDecksFile()
    }


    const deleteADeck = async (key: number) => {
        const {success} = await (window as any).electronAPI.deleteDeck(key)
        if(success == false) {
            setErrorMsg("There was an error deleting a topic.")
        }
        getDecksFile()

    }
    useEffect(()=> {
        if(explorerTopicSelection !== 0) {
            if(cardsFromDeck[explorerTopicSelection].cards?.length == 0) {
                setModifyDeckWindow(false)
            }
        }
    }, [cardsFromDeck])


    const [openTopicField, setOpenTopicField] = useState<boolean>(false)
    const [newTopicName, setNewTopicName] = useState<string>("")
    const [enterPressToggle, setEnterPressToggle] = useState<boolean>(false)
    const [numberTopics, setNumberTopics] = useState<string>("0 Topics")

    useEffect(()=> {
        if(newTopicName != "") {
            addADeck(newTopicName)
        }
        setNewTopicName("")
        setOpenTopicField(false)

    }, [enterPressToggle])

    const relieveTopicField = () => {
        setOpenTopicField(false)
        setNewTopicName("")
    }

    const deleteACard = async (deckId: string, cardKey: number) => {
        const {success} = await (window as any).electronAPI.deleteCard(deckId, cardKey)
        if(success) {
            getDecksFile()
            //Success
            getCardsFromDeck(explorerKey)
           
        }
        else {
            setErrorMsg("Could not delete card")
            //Failed
        }
        if(explorerTopicSelection !== 0) {
            if(cardsFromDeck[explorerTopicSelection].cards?.length == 0) {
                setModifyDeckWindow(false)
        }}
    }
    
    const addADeck = async (topicName: string) => {
        const {success, maxTopicError} = await (window as any).electronAPI.addDeck(topicName)
        if(maxTopicError) {
            setNumberTopics("Maximum Number of Topics (15)")
        }
        else if(success == false && maxTopicError) {
            setErrorMsg("There was an error adding a topic.")
        }
        getDecksFile()
    }

    const enterAddDeck = async function (e: any) {
        if(openTopicField) {
            if (e.key === 'Enter') {
                setEnterPressToggle(!enterPressToggle)
            }
            else if(e.key === "Escape") {
                relieveTopicField()
            }
        }
        else {
            setNewTopicName("")
        }
    }

    useEffect(()=> {
            if(openTopicField) {
                document.getElementById("focus")?.focus()
                document.getElementById('focus')?.addEventListener('keydown', enterAddDeck);
                
            }
            else {
                document.getElementById('focus')?.removeEventListener('keydown', enterAddDeck);

            }
        
    }, [openTopicField])

    
    const [decksFile, setDecksFile] = useState<null>(null);
    const [noDecks, setNoDecks] = useState(true);
    const [explorerTopicSelection, setExplorerTopicSelection] = useState<number | string>(0)
    
    
    useEffect(()=> {
        if(explorerTopicSelection == 0) {
            setExplorerKey(0)
        }
    }, [explorerTopicSelection])
   

    

    //Get JSON
    const getDecksFile = async () => {
        const {status, data} = await (window as any).electronAPI.getDecks("src/topics.json");
        const newData = JSON.parse(data)
        if(newData.status === true) {
            setNoDecks(false)
            setDecksFile(newData)
            var len = Object.keys(newData).length - 1
            if(len == 1) {
                setNumberTopics("1 deck")
            }
            else if(len > 1 && len < 15) {
                setNumberTopics(`${len.toString()} decks`)
            }
            else if(len == 15) {
                setNumberTopics("15 decks (maximum)")
            }
            
            
        }
        else {
            setNoDecks(true)
        }

    };

    const setTheme = async (themeName: string) => {
        const {success} = await (window as any).electronAPI.setTheme(themeName)
        if(success) {
            getTheme()
        }
        else {
            setErrorMsg("There was an error setting this theme")
        }
    }


    const getTheme = async () => {
        const {success, data} = await (window as any).electronAPI.getTheme()
        
        if(data.theme == "default") {
            document.documentElement.style.setProperty("--primary", "#e76b31") 
            document.documentElement.style.setProperty("--primary-dark", "#f18655")
            document.documentElement.style.setProperty("--primary-accent", "#e97946")
            document.documentElement.style.setProperty("--bg", "#fdfdfd") 
            document.documentElement.style.setProperty("--fg", "#3d3d3d")
            document.documentElement.style.setProperty("--darkgrey", "#646464")
            document.documentElement.style.setProperty("--lightgrey", "#bebebe")
            document.documentElement.style.setProperty("--grey-accent", "#c1c1c1")
        }
        else if(data.theme == "highgarden") {
            document.documentElement.style.setProperty("--primary", "purple")
            document.documentElement.style.setProperty("--primary-dark", "#c978c9")
            document.documentElement.style.setProperty("--primary-accent", "#b15fb1")
            document.documentElement.style.setProperty("--bg", "#ffffff")
            document.documentElement.style.setProperty("--fg", "#2b2929")
            document.documentElement.style.setProperty("--darkgrey", "#333333")
            document.documentElement.style.setProperty("--lightgrey", "#6e6e6e")
            document.documentElement.style.setProperty("--grey-accent", "#e3e3e6")
        }
        
    }

    useEffect(() => {
        getTheme()
        getDefaultAutoFormat();
        getDecksFile();
    }, []);



    //Menu Handling
    const relieveMenu = () => {
        setMenuHover(false)
        setDecksMenu(false)
        setViewMenu(false)
        setHelpMenu(false)
    }
    const [menuHover, setMenuHover] = useState(false);
    const [decksMenu, setDecksMenu] = useState(false);
    const [viewMenu, setViewMenu] = useState(false);
    const [helpMenu, setHelpMenu] = useState(false);

    const [mousePos, setMousePos] = useState<number[]>([0, 0])
    const [explorerContextMenuPos, setExplorerContextMenuPos] = useState<number[]>([0, 0])
    window.addEventListener("resize", relieveMenu);
    const mouseMove = async (e: any) => {
        setMousePos([e.clientX, e.clientY])
    }

    window.addEventListener("mousemove", mouseMove)

    //Explorer Resizing Handling
    const [explorerWidth, setExplorerWidth] = useState(300);
    const [isResizing, setIsResizing] = useState(false);


    useEffect(() => {
        const handlePointerMove = (e: any) => {
            if (!isResizing) return;
        
            if(Math.sign(e.movementX) === -1) {
            //Negative
                setErrorMsg("Shrinking... " + e.offsetX + "px")
                if(explorerWidth >= 200) {

                    setExplorerWidth((prev) => prev + e.movementX  - 5.5); // Adjust width based on pointer movement
                }

            }
            else {
                //Positive
                setErrorMsg("Enlarging... " + e.offsetX + "px")

                if(explorerWidth <= 600) {
                    setExplorerWidth((prev) => prev + e.movementX + 5.5); // Adjust width based on pointer movement
                }
            }
        };

        const handlePointerUp = () => {
            setIsResizing(false);
        };

        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);

        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
        };
    }, [isResizing]);


    //Explorer Handling
    const [explorerMenu, setExplorerMenu] = useState(true);
    const [explorerContextMenuKey, setExplorerContextMenuKey] = useState(0)

    const [errorMsg, setErrorMsg] = useState("Sterling")

        
    return(
        <div className="page">
            <meta httpEquiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';"  />
            <div className="titlebar" onClick={()=> {setExplorerContextMenuKey(0)}}>
                <p className="font font-small color-primary font-slim">Sterling</p>
                <div className="titlebar-item" onMouseEnter={()=> {
                    if(menuHover == true) {
                        setDecksMenu(true)
                        setViewMenu(false)
                        setHelpMenu(false)
                    }
                }} onClick={()=> {setMenuHover(!menuHover); setDecksMenu(!decksMenu); setViewMenu(false); setHelpMenu(false)}}>
                    <p className="font font-small color-darkgrey font-slim">Decks</p>
                    
                    <div className="titlebar-menu" style={{display : decksMenu ? 'flex' : 'none'}}>
                        <div className="titlebar-menu-item" onClick={()=> {setOpenTopicField(true)}}>
                            <p className="font font-small color-darkgrey font-slim">New Deck</p>
                            <p className="font font-small color-lightgrey font-slim">Ctrl + D</p>

                        </div>
                        <div className="titlebar-menu-item" style={{display: explorerKey != 0 ? "flex": "none"}} onClick={()=> {setOpenCardField(true)}}>
                            <p className="font font-small color-darkgrey font-slim">New Card</p>
                            <p className="font font-small color-lightgrey font-slim">Ctrl + T</p>

                        </div>
                        <div className="titlebar-menu-item-separator"></div>
                        <div className="titlebar-menu-item">
                            <p className="font font-small color-darkgrey font-slim">Load Deck</p>
                            <p className="font font-small color-lightgrey font-slim">Ctrl + O</p>

                        </div>
                        <div className="titlebar-menu-item">
                            <p className="font font-small color-darkgrey font-slim">Search Pre-Made Decks</p>
                            <p className="font font-small color-lightgrey font-slim">Ctrl + O</p>

                        </div>
                        <div className="titlebar-menu-item-separator"></div>
                        <div className="titlebar-menu-item" onClick={()=> {setDefaultAutoFormat(!defaultAutoFormat)}}>
                            <p className="font font-small color-darkgrey font-slim">{defaultAutoFormat ? "Disable" : "Enable"} Default Autoformat</p>
                            <p className="font font-small color-lightgrey font-slim">Ctrl + O</p>

                        </div>
                    </div>

                </div>
                <div className="titlebar-item" onMouseEnter={()=> {
                    if(menuHover == true) {
                        setDecksMenu(false)
                        setViewMenu(true)
                        setHelpMenu(false)
                    }
                }} onClick={()=> {setMenuHover(!menuHover); setDecksMenu(false); setViewMenu(!viewMenu); setHelpMenu(false)}}>
                    <p className="font font-small color-darkgrey font-slim">View</p>

                    <div className="titlebar-menu" style={{display : viewMenu ? 'flex' : 'none'}}>
                        <div className="titlebar-menu-item" onClick={()=> {setExplorerMenu(!explorerMenu)}}>
                            <p className="font font-small color-darkgrey font-slim">{explorerMenu ? 'Hide' : 'Show'} Explorer</p>

                        </div>
                        <div className="titlebar-menu-item-separator"></div>
                        <div className="titlebar-menu-item" onClick={()=> {setTheme("default")}}>
                            <p className="font font-small color-darkgrey font-slim">Default Theme</p>
                        </div>
                        <div className="titlebar-menu-item" onClick={()=> {setTheme("highgarden")}}>
                            <p className="font font-small color-darkgrey font-slim">Highgarden Theme</p>
                        </div>
                    </div>

                </div>
                <div className="titlebar-item" onMouseEnter={()=> {
                    if(menuHover == true) {
                        setDecksMenu(false)
                        setViewMenu(false)
                        setHelpMenu(true)
                    }
                }} onClick={()=> {setMenuHover(!menuHover); setDecksMenu(false); setViewMenu(false); setHelpMenu(!helpMenu)}}>
                    <p className="font font-small color-darkgrey font-slim">Help</p>

                    <div className="titlebar-menu" style={{display : helpMenu ? 'flex' : 'none'}}>
                        <div className="titlebar-menu-item">
                            <p className="font font-small color-darkgrey font-slim">Menu Item 1</p>
                        </div>
                        <div className="titlebar-menu-item">
                            <p className="font font-small color-darkgrey font-slim">Menu Item 1</p>
                        </div>
                        <div className="titlebar-menu-item">
                            <p className="font font-small color-darkgrey font-slim">Menu Item 1</p>
                        </div>
                    </div>

                </div>
                

            </div>

            <div className="page-section" onClick={()=> {relieveMenu(); setExplorerContextMenuKey(0)}}>
                <div className="explorer" style={{display : explorerMenu ? 'flex' : 'none', width: explorerWidth}}>
                    <div className="explorer-title">
                        <p onClick={()=> {relieveTopicField(); setExplorerTopicSelection(0)}} className="font font-super-small color-fg font-bold">EXPLORER</p>
                        
                        <div className="explorer-options">
                            <div className="explorer-option" onClick={()=> setOpenCardField(true)} style={{display: explorerKey != 0 ? "flex": "none"}}>
                                <div className="explorer-option-icon add-deck-icon"></div>
                                <div className="explorer-tooltip">
                                    <p className="font font-super-small color-fg font-slim">Add Card</p>
                                </div>
                            </div>
                            <div className="explorer-option" onClick={()=> {
                                setOpenTopicField(true)
                                
                                //addADeck("Test").then(getTopicsFile)
                                }}>
                                <div className="explorer-option-icon add-topic-icon"></div>
                                <div className="explorer-tooltip">
                                    <p className="font font-super-small color-fg font-slim">Add Deck</p>
                                </div>
                            </div>
                            <div className="explorer-option" onClick={()=> {
                                getDecksFile()
                            }}>
                                <div className="explorer-option-icon refresh-icon"></div>
                               <div className="explorer-tooltip">
                                    <p className="font font-super-small color-fg font-slim">Refresh Explorer</p>
                                </div>
                                
                            </div>
                            <div className="explorer-option" onClick={()=> {setExplorerMenu(!explorerMenu)}}>
                                <div className="explorer-option-icon collapse-icon"></div>
                                <div className="explorer-tooltip">
                                    <p className="font font-super-small color-fg font-slim">Hide Explorer</p>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                    <input className="explorer-topic-field font font-small font-slim color-darkgrey" onChange={e => setNewTopicName(e.target.value)} value={newTopicName} id="focus" style={{display: openTopicField ? "block" : "none"}}/>
                   
                    {noDecks ? <div className="explorer-no-topics" onClick={()=> {relieveTopicField(); relieveMenu(); setExplorerTopicSelection(0); setOpenCardField(false)}}><p className="font font-small color-darkgrey font-slim">You have no topics yet.</p></div> : 
                    <div className="explorer-topics" onContextMenu={()=> {relieveTopicField(); relieveMenu()}} onClick={()=> {relieveTopicField(); relieveMenu()}}>
                        {/* Topics Go Here */}
                        {decksFile != null ? Object.entries(decksFile).map((i: any, key:number)=> {
                            if(i[0] !== "status") {
                                return renameTopicField != key ? <div className="explorer-topic" key={key} onContextMenu={()=> {
                                    //Right Click
                                    setExplorerContextMenuKey(key)
                                    setExplorerContextMenuPos(mousePos)
                                    setExplorerTopicSelection(i[0])
                                    

                                }} onClick={()=> {
                                    
                                    if(i[0] == explorerTopicSelection) {
                                        setExplorerTopicSelection(0)
                                        setExplorerKey(0)
                                    }else {
                                        setExplorerTopicSelection(i[0])
                                        getCardsFromDeck(key)
                                        setExplorerKey(key)

                                    }
                                    }} style={{backgroundColor: i[0] == explorerTopicSelection ? "var(--primary-dark)": "var(--grey-accent)"}}>
                                    <div className={`${explorerTopicSelection == i[0] ? "explorer-topic-inner-no-hover" : "explorer-topic-inner"}`}>
                                        <div className="combine">
                                            <p className="font font-small font-slim color-fg">{i[1].deckTitle}</p>
                                        </div>
                                    {i[1].deckStatus == false ? <p className="font font-super-small font-slim color-darkgrey"><i>empty</i></p> : <p className="font font-super-small font-slim color-darkgrey"><i>{Object.keys(i[1].cards).length} cards(s)</i></p>}
                                    </div>
                                    <div className="explorer-topic-context-menu" style={{display: explorerContextMenuKey == key ? "flex" : "none", left: explorerContextMenuPos[0], top: explorerContextMenuPos[1]}}>
                                        <div className="explorer-topic-context-menu-item" onClick={()=> {
                                            //Delete Function
                                            deleteADeck(key)

                                        }}>
                                            <p className="font font-super-small font-slim color-fg">Delete</p>
                                            <p className="font font-super-small font-slim color-lightgrey">Del</p>


                                        </div>
                                        <div className="explorer-topic-context-menu-item" onClick={()=> {
                                            //Rename Function
                                            setRenameTopicField(key)
                                        }}>
                                            <p className="font font-super-small font-slim color-fg">Rename</p>
                                            <p className="font font-super-small font-slim color-lightgrey">Ctrl + Shift + R</p>
                                        </div>
                                    </div>

                                </div> : <input autoFocus onKeyDown={(e)=> {
                                    if(e.key == "Escape") {
                                        setRenameTopicField(0)
                                        setRenameTopicName("")
                                    }
                                    else if(e.key == "Enter") {
                                        //Rename
                                        renameADeck(renameTopicField, renameTopicName)
                                        setRenameTopicField(0)
                                        setRenameTopicName("")
                                    }


                                }} className="explorer-topic-field font font-small font-slim color-darkgrey" onChange={(e)=> {setRenameTopicName(e.target.value)}} />
                            }
                        }) : ""}
                    </div>
                    }
                    <div className="explorer-remaining" onClick={()=> {relieveTopicField(); setExplorerTopicSelection(0); setOpenCardField(false)}}>
                    </div>
                </div>
                <div className="explorer-adjustment" style={{display : explorerMenu ? 'flex' : 'none'}} onPointerDown={() => setIsResizing(true)}>
                    
                </div>

                

                <div className="free-window-full" style={{display: openGame ? "flex" : "none"}}>
                    <div className="free-window-inner-full">
                        <div className="free-window-header-full">
                            <p className="font font-slim color-fg font-small">Sterling</p>

                            <p className="font font-slim color-primary font-medium" style={{cursor:"pointer"}} onClick={()=> {setOpenGame(false); setDeckStage(0)}}>x</p>
                        </div>
                        <div className="free-window-content-full">
                            {openGame ? cardsFromDeck[explorerTopicSelection].cards.map((i: any, key: number) => {
                                

                                if(key == deckStage) {
                                    return <p onClick={()=> progressDeck()}>{i[0]} - {i[1]} {key}</p>
                                }
                                else if(cardsFromDeck[explorerTopicSelection].cards.length == deckStage) {
                                    return <p>Something</p>
                                }
                            }) : "Not Allowed"}

                        </div>
                    </div>
                </div>
                <div className="free-window" style={{display: modifyDeckWindow ? "flex":"none"}}>
                    <div className="free-window-inner">
                        <div className="free-window-header">
                            <p className="font font-slim color-fg font-small">Modify Deck</p>

                            <p className="font font-slim color-primary font-medium" style={{cursor:"pointer"}} onClick={()=> {setModifyDeckWindow(false)}}>x</p>
                        </div>
                        <div className="free-window-content">
                            {modifyDeckWindow ? cardsFromDeck[explorerTopicSelection].cards.map((i: any, key: number) => {
                                return <div className="free-window-item">
                                    <div className="free-window-item-inner">
                                            <div className="vertbine-baseline w25">
                                            <p className="font font-small color-fg font-slim">Front</p>
                                            <p className="font font-regular color-fg font-slim">{i[0]}</p>
                                            </div>
                                            <div className="vertbine-baseline w25">
                                            <p className="font font-small color-fg font-slim">Back</p>

                                            <p className="font font-regular color-fg font-slim">{i[1]}</p>
                                            </div>
                                        <p onClick={()=> {deleteACard(explorerTopicSelection?.toString(), key)}} className="font font-small color-fg font-slim cursor">Delete</p>
                                    </div>
                                </div>
                                
                            }) : <p className="font font-regular color-fg font-slim">Not Allowed</p>}
                        </div>
                    </div>
                </div>
                <div className="inner" onClick={()=> {relieveTopicField();}}>
                        {cardsFromDeck != null && explorerTopicSelection != 0 ? Object.entries(cardsFromDeck).map((i: any, key:number)=> {
                            if(i[1].deckStatus) {
                                if(openCardField && explorerTopicSelection != 0) {
                                    return(
                                        <div className="decks-page">
                                            <div className="vertbine">
                                                <h1 className="font font-title color-fg font-slim">Add Card to <i><span className="underline">{i[1].deckTitle}</span></i></h1>
                                                <div className="combine">

                                                    <div className="button" onClick={()=> {setAutoFormat(!autoFormat)}}>
                                                        <p className="font font-small color-bg font-slim">Auto-Format</p>
                                                    </div>
                                                    <p style={{transition: "all 0.25s ease-in-out"}} className="font font-small color-fg font-slim">{autoFormat ? "On" : "Off"}</p>
                                                    <div className={`${autoFormat ? "green-dot" : "red-dot"}`}></div>
                                                </div>
                                                <p onClick={()=> {triggerHelpAutoFormat()}} className="font font-small color-fg font-slim underline">What's this?</p>
                                            
                                            </div>
                                            <div className="downbine">
                                                <p className="font font-regular color-fg font-slim">Front</p>
                                                <textarea onChange={(e)=> {setCardFront(e.target.value)}} value={cardFront} className="deck-input font font-small color-fg font-slim" placeholder="Front side.."></textarea>
                                            </div>
                                            <div className="downbine">
                                                <p className="font font-regular color-fg font-slim">Back</p>
                                                <textarea onChange={(e)=> {setCardBack(e.target.value)}} value={cardBack} className="deck-input font font-small color-fg font-slim" placeholder="Back side.."></textarea>
                                            </div>
                    
                                            
                                            <div className="combine">
                                                <div className="button" onClick={()=> {addACard(i[0], cardFront, cardBack);}}>
                                                    <p className="font font-small color-bg font-slim">Add</p>
                                                </div> 
                                                <div className="button" onClick={()=> {setOpenCardField(false); setAddDeckMsg([false, ""])}}>
                                                    <p className="font font-small color-bg font-slim">I'm Done</p>
                                                </div> 
                                            </div>
                                            <p className={`${addDeckMsg[0] ? "color-green":"color-red"} font font-small font-slim`}>{addDeckMsg[1]}</p>
                                        </div>
                                    )
                                }
                                else {

                                //There is decks in this topic - display decks to user
                                return (<div className="decks-page">
                                    <div className="vertbine">
                                        <p className="font font-title color-fg font-slim">{i[1].deckTitle}</p>
                                        <p className="font font-regular color-fg font-slim">{Object.keys(i[1].cards).length} cards.</p>
                                    </div>
                                    <div className="combine">
                                        <div className="primary-button" onClick={()=> {setOpenGame(true)}}>
                                            <p className="font font-small color-bg font-slim">Start</p>
                                        </div>
                                        <div className="button" onClick={()=> setOpenCardField(true)}>
                                            <p className="font font-small color-bg font-slim">Add Card</p>
                                        </div>
                                        <div className="button" onClick={()=> setModifyDeckWindow(true)}>
                                            <p className="font font-small color-bg font-slim">Modify Deck</p>
                                        </div>
                                    </div>
                                </div>)
                                }
                            }
                            else {
                                //There is no decks - prompt user to add decks
                                if(openCardField && explorerTopicSelection != 0) {

                                    //No Decks Addition
                                    return(
                                        <div className="decks-page">
                                            <div className="vertbine">
                                                <h1 className="font font-title color-fg font-slim">Add Card to <i><span className="underline">{i[1].deckTitle}</span></i></h1>

                                                <div className="combine">

                                                    <div className="button" onClick={()=> {setAutoFormat(!autoFormat)}}>
                                                        <p className="font font-small color-bg font-slim">Auto-Format</p>
                                                    </div>
                                                    <p style={{transition: "all 0.25s ease-in-out"}} className="font font-small color-fg font-slim">{autoFormat ? "On" : "Off"}</p>
                                                    <div className={`${autoFormat ? "green-dot" : "red-dot"}`}></div>
                                                </div>
                                                <p onClick={()=> {triggerHelpAutoFormat()}} className="font font-small color-fg font-slim underline">What's this?</p>
                                            
                                            </div>
                                            <div className="downbine">
                                                <p className="font font-regular color-fg font-slim">Front</p>
                                                <textarea onChange={(e)=> {setCardFront(e.target.value)}} value={cardFront} className="deck-input font font-small color-fg font-slim" placeholder="Front side.."></textarea>
                                            </div>
                                            <div className="downbine">
                                                <p className="font font-regular color-fg font-slim">Back</p>
                                                <textarea onChange={(e)=> {setCardBack(e.target.value)}} value={cardBack} className="deck-input font font-small color-fg font-slim" placeholder="Back side.."></textarea>
                                            </div>
                    
                                            
                                            <div className="combine">
                                                <div className="button" onClick={()=> {addACard(i[0], cardFront, cardBack);}}>
                                                    <p className="font font-small color-bg font-slim">Add</p>
                                                </div> 
                                                <div className="button" onClick={()=> {setOpenCardField(false)}}>
                                                    <p className="font font-small color-bg font-slim">I'm Done</p>
                                                </div> 
                                            </div>
                                            <p className={`${addDeckMsg[0] ? "color-green":"color-red"} font font-small font-slim`}>{addDeckMsg[1]}</p>
                                        </div>
                                    )
                                }
                                else {
                                    return(<div className="decks-page">
                                        <div className="vertbine">
                                            <h1 className="font font-title color-fg font-slim">{i[1].deckTitle}</h1>
                                            <p className="font font-regular color-fg font-slim">No cards in this deck.</p>
                                        </div>
                                        <div className="button" onClick={()=> {setOpenCardField(true)}}>
                                            <p className="font font-small color-bg font-slim">Add Card</p>
                                        </div>    
                                    </div>
                                    )
                                }

                              
                            }
                        }) : <p className="font font-regular color-fg font-slim">Select a deck to view its cards.</p>}

                    
                </div>

            </div>
            <div className="statusbar">
                <div className="statusbar-item">
                    <p className="font font-super-small color-bg font-slim">{explorerTopicSelection}</p>
                </div>
                <div className="statusbar-item">
                    <p className="font font-super-small color-bg font-slim">{explorerKey}</p>
                </div>

                <div className="statusbar-item">
                    <p className="font font-super-small color-bg font-slim">{errorMsg}</p>
                </div>
                <div className="statusbar-item">
                    <p className="font font-super-small color-bg font-slim"></p>
                </div>
                
            </div>
            
        </div>
    )
}