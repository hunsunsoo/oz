// import { useRef } from 'react'
// // import Sheet from '../common/Sheet'
// // import classes from './Chatting.module.css'
// import ChattingLog from './ChattingLog'
// import { useEffect } from 'react'
// import { useState } from 'react'
// import { useSelector } from 'react-redux'

// const Chatting = () => {
//   const input = useRef()
//   const chattingLog = useRef()
//   const [chat, setChat] = useState({
//     messageList: [],
//     message: '',
//   })

//   const openvidu = useSelector(state => state.openvidu)

//   const { messageList, message } = chat
//   // console.log(openVidu)

//   useEffect(() => {
//     if (openvidu.publisher) {
//       openvidu.session.on('signal:chat', event => {
//         const data = JSON.parse(event.data)
//         messageList.push({
//           connectionId: event.from.connectionId,
//           nickname: data.nickname,
//           message: data.message,
//         })
//         setChat(prev => ({ ...prev, messageList }))
//         scrollToBottom()
//       })
//     }
//   }, [messageList])

//   function handleChange(event) {
//     // console.log(chat.message)
//     setChat(prev => ({
//       ...prev,
//       message: event.target.value,
//     }))
//   }

//   function handlePresskey(event) {
//     if (event.key === 'Enter') {
//       sendMessage()
//       event.target.value = ''
//     }
//   }

//   function sendMessage() {
//     if (chat.message) {
//       const data = {
//         message: chat.message,
//         nickname: openvidu.myUserName,
//       }
//       openvidu.publisher.session.signal({
//         data: JSON.stringify(data),
//         type: 'chat',
//       })
//     }
//     setChat(prev => ({
//       ...prev,
//       message: '',
//     }))
//   }

//   function scrollToBottom() {
//     setTimeout(() => {
//       try {
//         chattingLog.current.scrollTop = chattingLog.current.scrollHeight
//       } catch (err) {}
//     }, 20)
//   }

//   return (
//     <div className={classes.chatting}>
//       <div className={classes.flex_item_log}>
//         {/* <Sheet> */}
//         <div>
//           <div ref={chattingLog} className={classes.chatting_logs}>
//             {messageList.map(({ message, connectionId }, idx) => (
//               // <ChattingLog
//               //   key={idx}
//               //   textData={{
//               //     myStreamId: openvidu.session.connection.connectionId,
//               //     connectionId: connectionId,
//               //     message: message,
//               //   }}
//               // ></ChattingLog>
//               <div
//                 key={idx}
//                 textData={{
//                   myStreamId: openvidu.session.connection.connectionId,
//                   connectionId: connectionId,
//                   message: message,
//                 }}
//               ></div>
//             ))}
//           </div>
//         {/* </Sheet> */}
//         </div>
//       </div>
//       <div className={classes.flex_item_input}>
//         {/* <Sheet size="small"> */}
//         <div>
//           <input
//             className={classes.chatting_input}
//             onChange={handleChange}
//             onKeyUp={handlePresskey}
//             ref={input}
//           ></input>
//         {/* </Sheet> */}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Chatting