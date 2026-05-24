"use client"
import './index.css';
import { createRoot } from 'react-dom/client';
import {useState, useEffect} from 'react'
const root = createRoot(document.body);
root.render(<Sterling />);
function Sterling() {

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


    const addATopic = async (topicName: string) => {


        const {success, maxTopicError} = await (window as any).electronAPI.addTopic(topicName)
        if(maxTopicError) {
            setNumberTopics("Maximum Number of Topics (15)")
        }
        else if(success == false && maxTopicError) {
            setErrorMsg("There was an error")
        }
        getTopicsFile()
    }

    const enterAddTopic = async function (e: any) {
        if(openTopicField) {
            if (e.key === 'Enter') {
                setEnterPressToggle(!enterPressToggle)
            }
            else if(e.key === "Escape") {
                setOpenTopicField(false)
                setNewTopicName("")
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


    window.addEventListener("resize", relieveMenu);

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
    

    const [errorMsg, setErrorMsg] = useState("Sterling")

        
    return(
        <div className="page">
            <meta httpEquiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline';"  />
            <div className="titlebar">
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

            <div className="page-section" onClick={()=> {relieveMenu()}}>
                <div className="explorer" style={{display : explorerMenu ? 'flex' : 'none', width: explorerWidth}}>
                    <div className="explorer-title">
                        <p className="font font-super-small color-fg font-bold">EXPLORER</p>
                        
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
                            <div className="explorer-option">
                                <div className="explorer-option-icon collapse-icon"></div>
                                <div className="explorer-tooltip">
                                    <p className="font font-super-small color-fg font-slim">Collapse Topics</p>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                   
                    {noTopics ? <div className="explorer-no-topics"><p className="font font-small color-darkgrey font-slim">You have no topics yet.</p></div> : 
                    <div className="explorer-topics">
                        {/* Topics Go Here */}
                        {topicsFile != null ? Object.entries(topicsFile).map((i: any, key:number)=> {
                            if(i[0] !== "status") {
                                return <div className="explorer-topic" key={key} onClick={()=> {
                                    

                                    if(i[0] == explorerTopicSelection) {
                                        setExplorerTopicSelection(0)

                                    
                                    }else {
                                        setExplorerTopicSelection(i[0])
                                    }
                                    
                                    
                                    }} style={{backgroundColor: i[0] == explorerTopicSelection ? "var(--primary)": "unset"}} >
                                    <div className="combine">
                                        <p className="font font-small font-slim color-fg">{i[1].topicTitle}</p>
                                    </div>
                                    {i[1].topicStatus == false ? <p className="font font-super-small font-slim color-darkgrey"><i>topic</i></p> : ""}


                                </div>
                            }
                        }) : ""}
                    </div>
                    }
                    <input className="explorer-topic-field font font-small font-slim color-lightgrey" onChange={e => setNewTopicName(e.target.value)} value={newTopicName} id="focus" style={{display: openTopicField ? "block" : "none"}}/>
                        
                </div>
                <div className="explorer-adjustment" style={{display : explorerMenu ? 'flex' : 'none'}} onPointerDown={() => setIsResizing(true)}>
                    
                </div>
                <div className="inner">
                    <p className="font font-regular color-fg font-slim"></p>

                    
                </div>

            </div>
            <div className="statusbar">
                <div className="statusbar-item">
                    <p className="font font-super-small color-bg font-slim">{numberTopics}</p>
                </div>
                <div className="statusbar-item">
                    <p className="font font-super-small color-bg font-slim">{newTopicName}px</p>
                </div>
            </div>
            
        </div>
    )
}