"use client"
import React from 'react';
import './index.css';
import { createRoot } from 'react-dom/client';
import {useState, useEffect, useRef} from 'react'
const root = createRoot(document.body);
root.render(<Sterling />);

function Sterling() {




    //Get JSON
    




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
    const [noTopics, setNoTopics] = useState(true);
    

    const [errorMsg, setErrorMsg] = useState("Sterling")

        
    return(
        <div className="page">
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
                            <div className="explorer-option">
                                <div className="explorer-option-icon add-topic-icon"></div>
                                <div className="explorer-tooltip">
                                    <p className="font font-super-small color-fg font-slim">Add Topic</p>
                                </div>
                            </div>
                            <div className="explorer-option">
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
                    <div>
                        {/* Topics Go Here */}
                    </div>
                    }
                </div>
                <div className="explorer-adjustment" style={{display : explorerMenu ? 'flex' : 'none'}} onPointerDown={() => setIsResizing(true)}>
                    
                </div>
                <div className="inner">
                    <p className="font font-regular color-fg font-slim">You have no decks</p>
                </div>

            </div>
            <div className="statusbar">
                <div className="statusbar-item">
                    <p className="font font-super-small color-bg font-slim">{errorMsg}</p>
                </div>
                <div className="statusbar-item">
                    <p className="font font-super-small color-bg font-slim">{explorerWidth}px</p>
                </div>
            </div>
            
        </div>
    )
}