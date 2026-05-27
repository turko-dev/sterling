"use client"
import './index.css';
import { createRoot } from 'react-dom/client';
import {useState, useEffect} from 'react'
const root = createRoot(document.body);
root.render(<Sterling />);
function Sterling() {

    const [renameTopicField, setRenameTopicField] = useState<number>(0);
    const [renameTopicName, setRenameTopicName] = useState<string>("");


    const [decksFromTopic, setDecksFromTopic] = useState<any>(null)

    const getDecksFromTopic = async (key: number) => {
        const {success, data} = await (window as any).electronAPI.getDecksFromTopic(key)
        if(success == false) {
            setErrorMsg("There was an error getting the decks from a topic.")
        }
        else {
            setDecksFromTopic(data)
        }
    }

    const renameATopic = async (key: number, rename: string) => {
        const {success} = await (window as any).electronAPI.renameTopic(key, rename)
        if(success == false) {
            setErrorMsg("There was an error renaming a topic.")
        }
        getTopicsFile()
    }


    const deleteATopic = async (key: number) => {
        const {success} = await (window as any).electronAPI.deleteTopic(key)
        if(success == false) {
            setErrorMsg("There was an error deleting a topic.")
        }
        getTopicsFile()

    }


    const [openTopicField, setOpenTopicField] = useState<boolean>(false)
    const [newTopicName, setNewTopicName] = useState<string>("")
    const [enterPressToggle, setEnterPressToggle] = useState<boolean>(false)
    const [numberTopics, setNumberTopics] = useState<string>("0 Topics")

    useEffect(()=> {
        if(newTopicName != "") {
            addATopic(newTopicName)
        }
        setNewTopicName("")
        setOpenTopicField(false)

    }, [enterPressToggle])

    const relieveTopicField = () => {
        setOpenTopicField(false)
        setNewTopicName("")
    }

    
    const addATopic = async (topicName: string) => {
        const {success, maxTopicError} = await (window as any).electronAPI.addTopic(topicName)
        if(maxTopicError) {
            setNumberTopics("Maximum Number of Topics (15)")
        }
        else if(success == false && maxTopicError) {
            setErrorMsg("There was an error adding a topic.")
        }
        getTopicsFile()
    }

    const enterAddTopic = async function (e: any) {
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
                document.getElementById('focus')?.addEventListener('keydown', enterAddTopic);
                
            }
            else {
                document.getElementById('focus')?.removeEventListener('keydown', enterAddTopic);

            }
        
    }, [openTopicField])

    const [topicsFile, setTopicsFile] = useState<null>(null);
    const [noTopics, setNoTopics] = useState(true);
    const [explorerTopicSelection, setExplorerTopicSelection] = useState<number>()


   

    

    //Get JSON
    const getTopicsFile = async () => {
        const {status, data} = await (window as any).electronAPI.getTopics("src/topics.json");
        const newData = JSON.parse(data)
        if(newData.status === true) {
            setNoTopics(false)
            setTopicsFile(newData)
            var len = Object.keys(newData).length - 1
            if(len == 1) {
                setNumberTopics("1 topic")
            }
            else if(len > 1 && len < 15) {
                setNumberTopics(`${len.toString()} topics`)
            }
            else if(len == 15) {
                setNumberTopics("15 topics (maximum)")
            }
            
            
        }
        else {
            setNoTopics(true)
        }

    };

    useEffect(() => {
        getTopicsFile();
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
            <div className="titlebar" onClick={()=> {relieveTopicField(); setExplorerTopicSelection(0); setExplorerContextMenuKey(0)}}>
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
                        <div className="titlebar-menu-item">
                            <p className="font font-small color-darkgrey font-slim">New Deck</p>
                            <p className="font font-small color-lightgrey font-slim">Ctrl + D</p>

                        </div>
                        <div className="titlebar-menu-item">
                            <p className="font font-small color-darkgrey font-slim">New Topic</p>
                            <p className="font font-small color-lightgrey font-slim">Ctrl + T</p>

                        </div>
                        <div className="titlebar-menu-item-separator"></div>
                        <div className="titlebar-menu-item">
                            <p className="font font-small color-darkgrey font-slim">Open Deck</p>
                            <p className="font font-small color-lightgrey font-slim">Ctrl + O</p>

                        </div>
                        <div className="titlebar-menu-item">
                            <p className="font font-small color-darkgrey font-slim">Open Topic</p>
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
                        <div className="titlebar-menu-item">
                            <p className="font font-small color-darkgrey font-slim">Menu Item 1</p>
                        </div>
                        <div className="titlebar-menu-item">
                            <p className="font font-small color-darkgrey font-slim">Menu Item 1</p>
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
                            <div className="explorer-option">
                                <div className="explorer-option-icon add-deck-icon"></div>
                                <div className="explorer-tooltip">
                                    <p className="font font-super-small color-fg font-slim">Add Deck</p>
                                </div>
                            </div>
                            <div className="explorer-option" onClick={()=> {
                                setOpenTopicField(true)
                                
                                //addATopic("Test").then(getTopicsFile)
                                }}>
                                <div className="explorer-option-icon add-topic-icon"></div>
                                <div className="explorer-tooltip">
                                    <p className="font font-super-small color-fg font-slim">Add Topic</p>
                                </div>
                            </div>
                            <div className="explorer-option" onClick={()=> {
                                getTopicsFile()
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
                   
                    {noTopics ? <div className="explorer-no-topics"><p className="font font-small color-darkgrey font-slim">You have no topics yet.</p></div> : 
                    <div className="explorer-topics" onContextMenu={()=> {relieveTopicField(); relieveMenu()}} onClick={()=> {relieveTopicField(); relieveMenu()}}>
                        {/* Topics Go Here */}
                        {topicsFile != null ? Object.entries(topicsFile).map((i: any, key:number)=> {
                            if(i[0] !== "status") {
                                return renameTopicField != key ? <div className="explorer-topic" key={key} onContextMenu={()=> {
                                    //Right Click
                                    setExplorerContextMenuKey(key)
                                    setExplorerContextMenuPos(mousePos)
                                    setExplorerTopicSelection(i[0])
                                    

                                }} onClick={()=> {
                                    if(i[0] == explorerTopicSelection) {
                                        setExplorerTopicSelection(0)
                                    }else {
                                        setExplorerTopicSelection(i[0])
                                        getDecksFromTopic(key)
                                    }
                                    }} style={{backgroundColor: i[0] == explorerTopicSelection ? "var(--primary-dark)": "unset"}}>
                                    <div className={`${explorerTopicSelection == i[0] ? "explorer-topic-inner-no-hover" : "explorer-topic-inner"}`}>
                                        <div className="combine">
                                            <p className="font font-small font-slim color-fg">{i[1].topicTitle}</p>
                                        </div>
                                    {i[1].topicStatus == false ? <p className="font font-super-small font-slim color-darkgrey"><i>empty</i></p> : <p className="font font-super-small font-slim color-darkgrey"><i>{Object.keys(i[1].decks).length} deck(s)</i></p>}
                                    </div>
                                    <div className="explorer-topic-context-menu" style={{display: explorerContextMenuKey == key ? "flex" : "none", left: explorerContextMenuPos[0], top: explorerContextMenuPos[1]}}>
                                        <div className="explorer-topic-context-menu-item" onClick={()=> {
                                            //Delete Function
                                            deleteATopic(key)

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
                                        renameATopic(renameTopicField, renameTopicName)
                                        setRenameTopicField(0)
                                        setRenameTopicName("")
                                    }


                                }} className="explorer-topic-field font font-small font-slim color-darkgrey" onChange={(e)=> {setRenameTopicName(e.target.value)}} />
                            }
                        }) : ""}
                    </div>
                    }
                    <input className="explorer-topic-field font font-small font-slim color-darkgrey" onChange={e => setNewTopicName(e.target.value)} value={newTopicName} id="focus" style={{display: openTopicField ? "block" : "none"}}/>
                    <div className="explorer-remaining" onClick={()=> {
                        relieveTopicField(); setExplorerTopicSelection(0)}}>
                        
                    </div>
                </div>
                
                <div className="explorer-adjustment" style={{display : explorerMenu ? 'flex' : 'none'}} onPointerDown={() => setIsResizing(true)}>
                    
                </div>
                <div className="inner" onClick={()=> {relieveTopicField();}}>
                        {decksFromTopic != null && explorerTopicSelection != 0 ? Object.entries(decksFromTopic).map((i: any, key:number)=> {

                            if(i[1].topicStatus) {
                                //There is decks in this topic - display decks to user
                                return (<div className="decks-page">

                                    <div className="vertbine">
                                        <p className="font font-title color-fg font-slim">{i[1].topicTitle}</p>
                                        <p className="font font-regular color-fg font-slim">{Object.keys(i[1].decks).length} decks.</p>
                                        <div className="button">
                                            <p className="font font-small color-bg font-slim">Start</p>
                                        </div>
                                    </div>
                                    
                                    <div className="button">
                                        <p className="font font-small color-bg font-slim">Add Deck</p>
                                    </div>

                                </div>)
                            }
                            else {
                                
                                //There is no decks - prompt user to add decks

                                return(<div className="decks-page">
                                    <div className="vertbine">
                                        <h1 className="font font-title color-fg font-slim">{i[1].topicTitle}</h1>
                                        <p className="font font-regular color-fg font-slim">No decks in this topic.</p>
                                    </div>
                                    <div className="button">
                                        <p className="font font-small color-bg font-slim">Add Deck</p>
                                    </div>
                                </div>)

                            }
                        }) : <p className="font font-regular color-fg font-slim">Select a topic to view its decks.</p>}

                    
                </div>

            </div>
            <div className="statusbar">
                <div className="statusbar-item">
                    <p className="font font-super-small color-bg font-slim">{numberTopics}</p>
                </div>
                <div className="statusbar-item">
                    <p className="font font-super-small color-bg font-slim">{errorMsg}</p>
                </div>
            </div>
            
        </div>
    )
}