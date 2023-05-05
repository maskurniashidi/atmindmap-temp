import { useCallback, useState, useEffect, useContext } from 'react';
import ReactFlow, { Controls, Background, MiniMap, applyNodeChanges, useReactFlow, addEdge, useEdgesState, ReactFlowProvider, MarkerType, applyEdgeChanges } from 'reactflow';
import 'reactflow/dist/style.css';
import MultiSelectionToolbar from './MultiSelectionToolbar';
import TextUpdaterNode from '../components/TextUpdaterNode';
import "./styles/Flow.css";
import SimpleFloatingEdge from './SimpleFloatingEdge';
import { MindMapContext } from '../contexts/MindMapContext';
import { Button, Tooltip } from 'antd';
import { IoMdAddCircleOutline } from "react-icons/io"
import { MdOutlineDeleteSweep } from "react-icons/md"
import { BiImport, BiExport } from "react-icons/bi"
// import useKeyboardShortcut from 'use-keyboard-shortcut';
const proOptions = { hideAttribution: true };
const nodeTypes = { textUpdater: TextUpdaterNode };

// import { click } from '@testing-library/user-event/dist/click';

const edgeTypes = {
    floating: SimpleFloatingEdge,
};

function Flow() {
    const reactFlowInstance = useReactFlow();
    const { getReactFlowInstance, onAddNode, nodes, edges, nodesChange, edgesChange, activeNodesPosition, rootPos } = useContext(MindMapContext)

    getReactFlowInstance(reactFlowInstance);



    //! --------------------------------------------------
    //!                OTHER FUNCT/LOGIC
    //! --------------------------------------------------
    // console.log("nodes out 1", nodes)
    //  code ini umtuk mengecek apakah nodes ada isinya. Jika ada. 
    if (nodes.length !== 0) {
        localStorage.setItem("nodes", JSON.stringify(nodes));
        console.log("jalan")
    } else if (nodes.length === 0 && localStorage.getItem("nodes") !== null) {
        if (localStorage.getItem("nodes") === null || JSON.parse(localStorage.getItem("nodes")).length === 1) {
            localStorage.removeItem("nodes")
        }
    }

    if (edges.length !== 0) {
        localStorage.setItem("edges", JSON.stringify(edges));
        // console.log(edges);
    } else if (edges.length === 0 && localStorage.getItem("edges") !== null) {
        if (localStorage.getItem("edges") === null || JSON.parse(localStorage.getItem("edges")).length === 0) {
            localStorage.removeItem("edges")
        }
    }
    // console.log("nodes out 2", nodes)

    //! --------------------------------------------------
    //!                        MENU
    //! --------------------------------------------------

    const onRemoveAllNodes = () => {
        localStorage.removeItem("nodes")
        localStorage.removeItem("edges")
        localStorage.removeItem("active nodes")
        localStorage.removeItem("dataConvert")
        window.location.reload();
    }

    const downloadProject = () => {
        const jsonData = localStorage.getItem('dataConvert');
        const parsedData = JSON.parse(jsonData);
        const blob = new Blob([JSON.stringify(parsedData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'myMindMap.json';
        link.click();
    }

    const openProject = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const jsonData = event.target.result;
                const parsedData = JSON.parse(jsonData);
                localStorage.setItem("dataConvert", JSON.stringify(parsedData));
                // console.log("import data", parsedData)
                parseData(parsedData.root, true);
            };
            reader.readAsText(file);
        };
        input.click();
    }



    //! --------------------------------------------------
    //!                    CONVERT DATA
    //! --------------------------------------------------
    if (localStorage.getItem("edges") !== null && localStorage.getItem("nodes") !== null) {
        const transformData = () => {
            const nodes = JSON.parse(localStorage.getItem("nodes"));
            const edges = JSON.parse(localStorage.getItem("edges"));
            const rootNodes = nodes.filter((node) => {
                return !edges.some((edge) => edge.target === node.id);
            });

            const getChildren = (node) => {
                const childrenEdges = edges.filter((edge) => edge.source === node.id);
                if (childrenEdges.length > 0) {
                    const children = childrenEdges.map((edge) => {
                        const childNode = nodes.find((node) => node.id === edge.target);
                        const child = { id: childNode.id, edges: [{ id: edge.id, source: node.id, target: childNode.id, style: edge.style, type: edge.type }], ...childNode };
                        const childChildren = getChildren(childNode);
                        if (childChildren.length > 0) {
                            child.children = childChildren;
                        }
                        return child;
                    });
                    return children;
                } else {
                    return [];
                }
            };

            const transformedRootNodes = rootNodes.map((rootNode) => {
                const transformedNode = { id: rootNode.id, edges: [], ...rootNode };
                const children = getChildren(rootNode);
                if (children.length > 0) {
                    transformedNode.children = children;
                    transformedNode.edges = children.flatMap(child => child.edges);

                }
                return transformedNode;
            });

            return { root: transformedRootNodes };
        };

        const dataConvert = JSON.stringify(transformData());
        // console.log("data convert", dataConvert)
        localStorage.setItem("dataConvert", dataConvert);
    }

    //! --------------------------------------------------
    //!                   UNCONVERT DATA
    //! --------------------------------------------------


    const nodesUnconvert = [];
    const edgesUnconvert = [];
    function parseData(data, openProject) {
        data.forEach(item => {
            nodesUnconvert.push({ id: item.id, data: item.data, dragging: item.dragging, height: item.height, position: item.position, positionAbsolute: item.positionAbsolute, selected: item.selected, style: item.style, type: item.type, width: item.width });
            if (item.edges) {
                item.edges.forEach(edge => {
                    edgesUnconvert.push({
                        id: edge.id,
                        source: edge.source,
                        target: edge.target,
                        type: edge.type,
                        style: edge.style
                    });
                });
            }

            if (item.children) {
                parseData(item.children);
            }
        });


        // console.log("open cuy")
        localStorage.setItem("nodes", JSON.stringify(nodesUnconvert));
        localStorage.setItem("edges", JSON.stringify(edgesUnconvert.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id))));
        // console.log("parse data nodes", nodesUnconvert)
        // console.log("parse data edges", edgesUnconvert.filter((item, index, self) => index === self.findIndex((t) => t.id === item.id)));
        window.location.reload();

    }


    //! --------------------------------------------------
    //!                 SIDE EFFECT
    //! --------------------------------------------------
    useEffect(() => {
        // console.log("effect")
        if (localStorage.getItem("nodes") !== null) {
            reactFlowInstance.addNodes(JSON.parse(localStorage.getItem("nodes")));
            // console.log("effect", nodes)
        }
        if (localStorage.getItem("edges") !== null) {
            reactFlowInstance.addEdges(JSON.parse(localStorage.getItem("edges")));
            // console.log("effect", edges)
        }
    }, []);



    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === "Control") {
                localStorage.setItem("ctrl", true);
            }
            if (e.shiftKey && e.key === 'Enter') {
                // console.log("tes pos", activeNodesPosition, rootPos, nodes)
                if (activeNodesPosition > rootPos) {
                    onAddNode(reactFlowInstance, "right");
                } else {
                    onAddNode(reactFlowInstance, "left");
                }

            } else if (localStorage.getItem("ctrl") === "true" && e.shiftKey) {
                // console.log("ctrl + shift ditekan")
            }


        }

        const onKeyUp = (e) => {
            if (e.key === "Control") {
                localStorage.removeItem("ctrl")
            }
        }

        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("keyup", onKeyUp);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("keyup", onKeyUp);
        }
    }, [activeNodesPosition, rootPos])



    //! --------------------------------------------------
    //!                     RETURN JSX
    //! --------------------------------------------------

    return (
        <div style={{ height: '100vh' }}>
            <div className="menuLeft flex">
                <button onClick={() => onAddNode(reactFlowInstance)} className="absolute left-6 top-24 bg-white z-50 rounded-lg shadow-md py-2 px-4">
                    <Tooltip placement="rightTop" title="Add Node/shift+enter">
                        <IoMdAddCircleOutline className="iconMenuLeft" />
                    </Tooltip>
                </button>
                <button onClick={onRemoveAllNodes} className="absolute left-6 top-40  bg-white z-50 rounded-lg shadow-md py-2 px-4">
                    <Tooltip placement="rightTop" title="Remove All Nodes">
                        <MdOutlineDeleteSweep className="iconMenuLeft" />
                    </Tooltip>
                </button>
                <button onClick={openProject} className="absolute left-6 top-56 bg-white z-50 rounded-lg shadow-md py-2 px-4">
                    <Tooltip placement="rightTop" title="Open Project">
                        <BiImport className="iconMenuLeft" />
                    </Tooltip>
                </button>
                <button onClick={downloadProject} className="absolute left-6 top-72 bg-white z-50 rounded-lg shadow-md py-2 px-4">
                    <Tooltip placement="rightTop" title="Export">
                        <BiExport className="iconMenuLeft" />
                    </Tooltip>
                </button>
            </div>
            <ReactFlow
                proOptions={proOptions}
                // zoomSnap={{ minZoom: 0.5, maxZoom: 2 }}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                // onConnect={onConnect}
                defaultNodes={nodes}
                defaultEdges={edges}
                onEdgesChange={edgesChange}
                onNodesChange={nodesChange}
                className="intersection-flow"
                fitView
            >
                <Background />
                <Controls />
                <MiniMap nodeStrokeWidth={3} zoomable pannable />
                <MultiSelectionToolbar />
            </ReactFlow>
        </div>
    );
}

export default () => (
    <ReactFlowProvider>
        <Flow />
    </ReactFlowProvider>
);
