// import React from "react";
// import styles from "./Comment.module.css";
// import { Draggable } from "../Draggable/Draggable";
// import ContextMenu, { menuOption } from "../ContextMenu/ContextMenu";
// import { ColorPicker } from "../ColorPicker/ColorPicker";
// import { Portal } from "react-portal";
// import clamp from "lodash/clamp";
// import { coordinates } from "../../types";
// import { EditorDispatchContext } from "../../utilities";

// type CommentProps = {
//   id: string;
//   x?: number;
//   y?: number;
//   width?: number;
//   height?: number;
//   color?: string;
//   text?: string;
//   stageRect?: React.MutableRefObject<DOMRect | null>;
//   onDragStart: () => void;
//   isNew?: boolean;
// };

// export const Comment: React.FC<CommentProps> = ({
//   id,
//   x = 0,
//   y = 0,
//   width,
//   height,
//   color,
//   text,
//   stageRect,
//   onDragStart,
//   isNew,
// }) => {
//   const dispatch = React.useContext(EditorDispatchContext);
//   const wrapper = React.useRef<HTMLDivElement>(null);

//   const [isEditing, setIsEditing] = React.useState(false);
//   const [isPickingColor, setIsPickingColor] = React.useState(false);
//   const [menuOpen, setMenuOpen] = React.useState(false);
//   const [menuCoordinates, setMenuCoordinates] = React.useState({ x: 0, y: 0 });
//   const [colorPickerCoordinates, setColorPickerCoordinates] = React.useState({
//     x: 0,
//     y: 0,
//   });

//   const handleContextMenu = (
//     e: React.MouseEvent<HTMLDivElement, MouseEvent>
//   ) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setMenuCoordinates({ x: e.clientX, y: e.clientY });
//     setMenuOpen(true);
//     return false;
//   };

//   const closeContextMenu = () => setMenuOpen(false);

//   const startDrag = (_e: MouseEvent) => {
//     onDragStart();
//   };

//   const handleDrag = (coordinates: coordinates, _e: MouseEvent) => {
//     wrapper.current
//       ? (wrapper.current.style.transform = `translate(${coordinates.x}px,${coordinates.y}px)`)
//       : null;
//   };

//   const handleDragEnd = (coordinates: coordinates, _e: MouseEvent) => {
//     dispatch({
//       type: "SET_COMMENT_COORDINATES",
//       id,
//       x: coordinates.x,
//       y: coordinates.y,
//     });
//   };

//   const handleResize = (coordinates: coordinates, _e: MouseEvent) => {
//     const width = clamp(coordinates.x - x + 10, 80, 10000);
//     const height = clamp(coordinates.y - y + 10, 30, 10000);
//     wrapper.current ? (wrapper.current.style.width = `${width}px`) : null;
//     wrapper.current ? (wrapper.current.style.height = `${height}px`) : null;
//   };

//   const handleResizeEnd = (coordinates: coordinates, _e: MouseEvent) => {
//     const width = clamp(coordinates.x - x + 10, 80, 10000);
//     const height = clamp(coordinates.y - y + 10, 30, 10000);
//     dispatch({
//       type: "SET_COMMENT_DIMENSIONS",
//       id,
//       width,
//       height,
//     });
//   };

//   const handleMenuOption = (option: menuOption) => {
//     switch (option.value) {
//       case "edit":
//         startTextEdit();
//         break;

//       case "color":
//         setColorPickerCoordinates(menuCoordinates);
//         setIsPickingColor(true);
//         break;

//       case "delete":
//         dispatch({
//           type: "DELETE_COMMENT",
//           id,
//         });
//         break;

//       default:
//     }
//   };

//   const startTextEdit = () => {
//     setIsEditing(true);
//   };

//   const endTextEdit = () => {
//     setIsEditing(false);
//   };

//   const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     dispatch({
//       type: "SET_COMMENT_TEXT",
//       id,
//       text: e.target.value,
//     });
//   };

//   const handleColorPicked = (color: string) => {
//     dispatch({
//       type: "SET_COMMENT_COLOR",
//       id,
//       color,
//     });
//   };

//   React.useEffect(() => {
//     if (isNew) {
//       setIsEditing(true);
//       dispatch({
//         type: "REMOVE_COMMENT_NEW",
//         id,
//       });
//     }
//   }, [isNew, dispatch, id]);

//   return (
//     <Draggable
//       innerRef={wrapper}
//       className={styles.wrapper}
//       style={{
//         transform: `translate(${x}px,${y}px)`,
//         width,
//         height,
//         zIndex: isEditing ? 999 : 0,
//       }}
//       stageRect={stageRect}
//       onDragStart={startDrag}
//       onDrag={handleDrag}
//       onDragEnd={handleDragEnd}
//       onContextMenu={handleContextMenu}
//       onDoubleClick={startTextEdit}
//       onWheel={(e) => e.stopPropagation()}
//       data-color={color}
//     >
//       {isEditing ? (
//         <textarea
//           className={styles.textarea}
//           onChange={handleTextChange}
//           onMouseDown={(e) => e.stopPropagation()}
//           onBlur={endTextEdit}
//           placeholder="Text of the comment..."
//           value={text}
//         />
//       ) : (
//         <div data-comment={true} className={styles.text}>
//           {text}
//         </div>
//       )}
//       <Draggable
//         className={styles.resizeThumb}
//         stageRect={stageRect}
//         onDrag={handleResize}
//         onDragEnd={handleResizeEnd}
//       />
//       {menuOpen ? (
//         <Portal>
//           <ContextMenu
//             hideFilter
//             label="Comment Options"
//             x={menuCoordinates.x}
//             y={menuCoordinates.y}
//             options={[
//               {
//                 value: "edit",
//                 label: "Edit Comment",
//                 description: "Edit the text of the comment",
//               },
//               {
//                 value: "color",
//                 label: "Change Color",
//                 description: "Change the color of the comment",
//               },
//               {
//                 value: "delete",
//                 label: "Delete Comment",
//                 description: "Delete the comment",
//               },
//             ]}
//             onRequestClose={closeContextMenu}
//             onOptionSelected={handleMenuOption}
//           />
//         </Portal>
//       ) : null}
//       {isPickingColor ? (
//         <Portal>
//           <ColorPicker
//             x={colorPickerCoordinates.x}
//             y={colorPickerCoordinates.y}
//             onRequestClose={() => setIsPickingColor(false)}
//             onColorPicked={handleColorPicked}
//           />
//         </Portal>
//       ) : null}
//     </Draggable>
//   );
// };
