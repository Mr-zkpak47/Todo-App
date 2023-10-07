import React, { useState, useCallback } from 'react';
import './App.css';

function Card({ color, setColor, card, onTitleChange, onTextChange, onToggle, onDisplay, onStatus, onSave }) {
  return (
    <div className={`card ${card.isRotated ? 'card rotate-card' : 'card'}`} key={card.id} style={{ backgroundColor: color }}>
      <div className="cardStructure">
        {(!card.isEditing || card.isSaving) ? (
          <>
            <div className="cardHeader">
              <button className='status' onClick={onStatus}>{card.cardStatus === false ? "Complete" : "Completed"}</button>
              <button className="edit" onClick={onToggle}><i class="fa-solid fa-newspaper"></i>{!card.isSaving ? "Edit" : "Edited"}</button>
              <button className='cross' onClick={onDisplay}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="cardBody">
              <h1><u>
                {card.title}
              </u>
              </h1>
              <p>{card.text}</p>
            </div>
            <div className="cardFooter">
              <p><span style={{ color: "red" }}>
                Status :
              </span>
                &ensp;
                {card.cardStatus === false
                  ?
                  <>
                 Pending <i class="fa-regular fa-clock fa-xl"></i>
                  </>
                  : <>
                  <span  style={{color:"white"}}>
                  Completed <i class="fa-solid fa-circle-check fa-xl" style={{color:"white"}}></i>
                  </span>
                  </>
                }
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="card-header cardHeader">
              <p>Editing Mode : </p>
              <button className='cross' onClick={onDisplay}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <div className="card-body cardBody">
              <input type="text" value={card.title} onChange={onTitleChange} />
              <textarea type="text" value={card.text} onChange={onTextChange} />
              <button className="editSave" onClick={onSave}>Save</button>
            </div>
            <div className="card-footer cardFooter">
              <p>Status : Editing</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SideBar({ color, setColor, showPopUp, setShowPopUp, total, complete }) {
  return (
    <>
      <section className="sidebar">
        <div className="side-container">
          <div className="side-header">
            <h1 className="logo">
              To do
            </h1>
          </div>
          <div className="side-body">
            <button className="createBtn" onClick={() => {
              setShowPopUp(!showPopUp)
              console.log(showPopUp)
            }}>
              <i class="fa-solid fa-plus fa-xl"></i>
              <span className="txt">
                Create New Card
              </span>
            </button>
          </div>
          <div className="side-footer">
            <p>
              Total Tasks:&ensp;&ensp;
              <span style={{ color: "#F44336", fontWeight: "bolder" }}>
                {total}
              </span>
            </p>
            <p>
              Completed:&ensp;&ensp;
              <span style={{ color: "#F44336", fontWeight: "bolder" }}>
                {complete}
              </span>
            </p>
            <p>
              Remaining:&ensp;&ensp;
              <span style={{ color: "#F44336", fontWeight: "bolder" }}>
                {total - complete}
              </span>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}

function App() {
  const initialItems = [];
  const [items, setItems] = useState(initialItems);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [showPopUp, setShowPopUp] = useState(false)
  const [total, setTotal] = useState(items.length)
  const [complete, setComplete] = useState(0)
  const [color, setColor] = useState("white")
  const handleTitleChange = useCallback((id, e) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            title: e.target.value,
          };
        } else {
          return item;
        }
      })
    );
  }, []);

  const handleTextChange = useCallback((id, e) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            text: e.target.value,
          };
        } else {
          return item;
        }
      })
    );
  }, []);

  const handleToggleCard = useCallback((id) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            isEditing: true,
          };
        } else {
          return item
        }
      })
    );
  }, []);

  const handleSaveCard = useCallback((id) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            isSaving: !item.isSaving,
          };
        } else {
          return item
        }
      })
    );
  }, []);

  const handleDisplayCard = useCallback((id) => {
    setTotal((prevTotal) => prevTotal - 1);
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            isDisplay: !item.isDisplay,
            isRotated: !item.isRotated, 
          };
        } else {
          return item;
        }
      });

      // Check if the card being hidden is completed
      const cardBeingHidden = prevItems.find((item) => item.id === id);
      if (cardBeingHidden && cardBeingHidden.cardStatus === true) {
        // If it's completed, decrement the complete counter by 1
        setComplete((prevComplete) => prevComplete - 1);
      }
      console.log(color)
      return updatedItems;
    });
  }, []);

  const handleStatusCard = useCallback((id) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          //  document.body.querySelectorAll(".card")[item.id].style.backgroundColor = "red"
          return {
            ...item,
            cardStatus: !item.cardStatus,
            editText: "Edited",
          };
        } else {
          return item;
        }
      })
    );

    // Use the updated state value for items to compute the new complete count
    setItems((prevItems) => {
      const cardBeingUpdated = prevItems.find((item) => item.id === id);
      if (cardBeingUpdated) {
        if (cardBeingUpdated.cardStatus === false) {
          // If it changes to pending, decrement the complete counter
          setComplete((prevComplete) => prevComplete - 1);
          document.body.querySelectorAll(".card")[cardBeingUpdated.id].style.backgroundColor = "#fdfdfd"
          document.body.querySelectorAll(".status")[cardBeingUpdated.id].style.backgroundColor = "chartreuse"
        } else {
          // If it changes to completed, increment the complete counter
          setComplete((prevComplete) => prevComplete + 1);
          document.body.querySelectorAll(".card")[cardBeingUpdated.id].style.backgroundColor = "#7fff00ba"
          document.body.querySelectorAll(".status")[cardBeingUpdated.id].style.backgroundColor = "white"

        }
      }
      return prevItems;
    });
  }, []);

  const handlePopUpTitle = (e) => {
    setTitle(e.target.value);
  };
  const handlePopUpText = (e) => {
    setText(e.target.value);
  };

  const onCreate = () => {
    setTotal(total => total + 1)
    const newId = items.length; // Generate a new ID based on the current length of items
    setItems((prevItems) => [
      ...prevItems,
      { title: title, text: text, id: newId, isEditing: false, isSaving: false,isRotated : false, isDisplay: true, cardStatus: false, editText: "Edit" },
    ]);
    setShowPopUp(!showPopUp)
    setText(""); // Clear the input field after creating a new card
    setTitle(""); // Clear the input field after creating a new card
  };

  const onCancel = () => {
    setShowPopUp(!showPopUp)
  }

  const sleep = () => {
    return new Promise((res) => {
      setTimeout(res, 5000)
    })
  }
  return (
    <>
      <div className="container">
        <div className="sidebarContainer">

          <SideBar color={color} setColor={setColor} showPopUp={showPopUp} setShowPopUp={setShowPopUp} total={total} complete={complete} />
        </div>
        <div className="outerCardContainer">
          <div className="cardContainer">

            {showPopUp ? (
              <div className="popup">
                <p>Add Title : </p>
                <input type="text" placeholder='Title' className="title" value={title} onChange={(e) => handlePopUpTitle(e)} required />
                <p>Add Description : </p>
                <textarea type="text" placeholder='Description' className="text" value={text} onChange={(e) => handlePopUpText(e)} />
                <div className="buttons">
                  <button className="popUpButton" type="submit" onClick={() => onCreate()} value={title}>Add</button>
                  <button className="popUpButton" onClick={() => onCancel()} value={title}>Cancel</button>
                </div>
              </div>
            ) :
              ""
            }
            {items.map((item) => (
              item.isDisplay ? (
                <Card
                  key={item.id}
                  card={item}
                  onTitleChange={(e) => handleTitleChange(item.id, e)}
                  onTextChange={(e) => handleTextChange(item.id, e)}
                  onToggle={() => handleToggleCard(item.id)}
                  onDisplay={async () => {
                    handleDisplayCard(item.id);
                  }
                  }
                  onStatus={() => handleStatusCard(item.id)}
                  onSave={() => { handleSaveCard(item.id) }}
                  color={color}
                  setColor={setColor}
                />
              ) : (
                ""
              )
            )
            )
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
