import React, { useCallback, useState, useContext, useEffect } from "react";
import { Handle, Position, useReactFlow, NodeToolbar, useEdgesState, applyNodeChanges } from "reactflow";
import "./styles/text-updater-node.css";
import { cekData, addNode } from "./Menu";
import { MindMapContext } from "../contexts/MindMapContext";
import { Input } from 'antd';
import { IoMdAdd, IoMdAddCircle } from "react-icons/io"
const { TextArea } = Input;
const handleStyle = { left: 10 };

function TextUpdaterNode({ id, data }) {
  const [value, changeValue] = useState(data.value);
  const [style, setStyle] = useState(data.style)
  const [trigger, setTrigger] = useState(0);
  const reactFlowInstance = useReactFlow();
  const { onAddNode, activeNodesPosition, rootPos, setNodes, nodes, nodesChange, nodesChange2 } = useContext(MindMapContext)

  const onChange = useCallback((evt) => {
    console.log("halo")
    changeValue(evt.target.value);
    var dataLocal = JSON.parse(localStorage.getItem("nodes"))
    var objIndex = dataLocal.findIndex((obj) => obj.id == id)
    dataLocal[objIndex].data.value = evt.target.value;
    localStorage.setItem("nodes", JSON.stringify(dataLocal));
    console.log(data.style)
  }, []);

  const changeWeight = useCallback((type) => {
    var dataLocal = JSON.parse(localStorage.getItem("nodes"))
    var objIndex = dataLocal.findIndex((obj) => obj.id == id)
    dataLocal[objIndex].data.style.fontWeight = type;
    console.log("change weight", dataLocal[objIndex].data.style.fontWeight)
    console.log("data", dataLocal, nodes)
    localStorage.setItem("nodes", JSON.stringify(dataLocal));
    // setNodes((nds) => dataLocal)
    console.log(setNodes(dataLocal))
    // window.location.reload()
    setNodes(dataLocal)
  }, [setNodes, id]);


  // const changeWeight = (type) => {
  //   var dataLocal = JSON.parse(localStorage.getItem("nodes"))
  //   var objIndex = dataLocal.findIndex((obj) => obj.id == id)
  //   dataLocal[objIndex].data.style.fontWeight = type;
  //   console.log("change weight", dataLocal[objIndex].data.style.fontWeight)
  //   console.log("data", dataLocal, nodes)
  //   localStorage.setItem("nodes", JSON.stringify(dataLocal));
  //   // setStyle(dataLocal[objIndex].data.style)
  // }




  // useEffect(() => {
  //   console.log("tes")
  // }, [value]);

  return (
    <div className="text-updater-node">
      {/* <div className="toolbar-control__custom">
        <NodeToolbar className="toolbar-control__menu" isVisible={data.toolbarVisible} position="top">
          <button onClick={() => changeWeight("bold")}>Change Bold</button>
          <button onClick={() => changeWeight("normal")}>Change Normal</button>
          <button>Change Color</button>
        </NodeToolbar>
      </div> */}
      {
        activeNodesPosition > rootPos && <div className="toolbar-control">
          <NodeToolbar isVisible={data.toolbarVisible} position="right">
            <button onClick={() => onAddNode(reactFlowInstance, "right")} className="add-node__toolbar" >
              <IoMdAdd className="icon-add__node" />
            </button>
          </NodeToolbar>
        </div>
      }
      {
        activeNodesPosition < rootPos && <div className="toolbar-control">
          <NodeToolbar isVisible={data.toolbarVisible} position="left">
            <button onClick={() => onAddNode(reactFlowInstance, "left")} className="add-node__toolbar" >
              <IoMdAdd className="icon-add__node" />
            </button>
          </NodeToolbar>
        </div>
      }

      {
        (activeNodesPosition === rootPos || rootPos === 0) && <>
          <div className="toolbar-control">
            <NodeToolbar isVisible={data.toolbarVisible} position="left">
              <button onClick={() => onAddNode(reactFlowInstance, "left")} className="add-node__toolbar" >
                <IoMdAdd className="icon-add__node" />
              </button>
            </NodeToolbar>
          </div>
          <div className="toolbar-control">
            <NodeToolbar isVisible={data.toolbarVisible} position="right">
              <button onClick={() => onAddNode(reactFlowInstance, "right")} className="add-node__toolbar" >
                <IoMdAdd className="icon-add__node" />
              </button>
            </NodeToolbar>
          </div>
        </>
      }
      <Handle type="target" position={Position.Right} id="TargetRight" className='edge-dot' />
      <Handle type="target" position={Position.Left} id="TargetLeft" className='edge-dot' />
      <Handle type="target" position={Position.Top} id="TargetTop" className='edge-dot' />
      <Handle type="target" position={Position.Bottom} id="TargetBottom" className='edge-dot' />

      <TextArea
        style={data.style}
        id="text"
        name="text"
        onChange={onChange}
        autoComplete="off"
        value={value}
        autoSize={{ minRows: 1, maxRows: 999 }}
        bordered={false}
        className="text-updater__input"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const textarea = e.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const value = textarea.value;
            textarea.value = value.substring(0, start) + "\n" + value.substring(end);
            textarea.selectionStart = textarea.selectionEnd = start + 1;
          } else if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault();
          }
        }}
      />
      <p className="text-hide">
        {value.split("\n").map((line, index) => {
          return (
            <React.Fragment key={index}>
              {line}
              {index !== value.split("\n").length - 1 && React.createElement("br")}
            </React.Fragment>
          );
        })}
      </p>
      {/* <div>
        <input className="text-updater__input" size={Math.min(Math.max(value.replace(/\s/g, '').length, 10), 999)} id="text" name="text" onChange={onChange} autoComplete="off" value={value} />
      </div> */}
      <Handle type="source" position={Position.Left} id="Sourceleft" className='edge-dot' />
      <Handle type="source" position={Position.Right} id="SourceRight" className='edge-dot' />
      <Handle type="source" position={Position.Top} id="SourceTop" className='edge-dot' />
      <Handle type="source" position={Position.Bottom} id="SourceBottom" className='edge-dot' />
    </div >
  );
}

export default TextUpdaterNode;
