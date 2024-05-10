import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import data from "./celebrities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  const diff = now - dob;
  const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  return age;
}

function App() {
  const [openAccordionId, setOpenAccordionId] = useState(null);
  const [dataWithEditMode, setDataWithEditMode] = useState(
    data.map((user) => ({
      ...user,
      editMode: false,

      originalGender: user.gender,
      originalCountry: user.country,
      originalDescription: user.description,
    }))
  );

  const toggleAccordion = (id) => {
    if (!dataWithEditMode.find((user) => user.editMode)) {
      setOpenAccordionId((prevId) => (prevId === id ? null : id));
    }
  };

  const toggleEditMode = (id) => {
    setDataWithEditMode((prevData) =>
      prevData.map((user) =>
        user.id === id
          ? {
              ...user,
              editMode: !user.editMode,
              age: user.editMode ? calculateAge(user.dob) : user.age,

              gender: user.editMode ? user.gender : user.originalGender,
              country: user.editMode ? user.country : user.originalCountry,
              description: user.editMode
                ? user.description
                : user.originalDescription,
            }
          : user
      )
    );
  };

  const saveChanges = (id) => {
    setDataWithEditMode((prevData) =>
      prevData.map((user) =>
        user.id === id
          ? {
              ...user,
              editMode: false,
              age: user.age,
              originalGender: user.gender,
              originalCountry: user.country,
              originalDescription: user.description,
            }
          : user
      )
    );
  };

  const revertChanges = (id) => {
    setDataWithEditMode((prevData) =>
      prevData.map((user) =>
        user.id === id
          ? {
              ...user,
              editMode: false,
              gender: user.originalGender,
              country: user.originalCountry,
              description: user.originalDescription,
            }
          : user
      )
    );
  };

  const [itemToDelete, setItemToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = dataWithEditMode.filter((user) =>
    `${user.first} ${user.last}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  const handleDeleteClick = (id) => {
    setItemToDelete(id);
  };
  const handleCancelDelete = () => {
    setItemToDelete(null);
  };
  const handleConfirmDelete = (id) => {
    setDataWithEditMode((prevData) =>
      prevData.filter((user) => user.id !== id)
    );
    setItemToDelete(null);
  };
  return (
    <div className="container">
      <div>
        <h3 className="">List View </h3>
        <input
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
          placeholder="Search user"
          type="search"
        />
        <CiSearch className="search-icon" />
        <div className="accordian">
          <div>
            {filteredData.map((user) => (
              <div
                className={`border ${
                  openAccordionId === user.id ? "open" : "closed"
                }`}
                key={user.id}
              >
                <div
                  style={{ cursor: "pointer" }}
                  className="header-acc"
                  onClick={() => toggleAccordion(user.id)}
                >
                  <div className="user-info">
                    <img
                      className="pic"
                      src={user.picture}
                      alt={`${user.first} ${user.last}`}
                    />
                    <h2 style={{ marginTop: "10px" }}>
                      {user.first} {user.last}
                    </h2>
                  </div>
                  <FontAwesomeIcon
                    style={{ marginTop: "20px" }}
                    icon={
                      openAccordionId === user.id ? faChevronUp : faChevronDown
                    }
                  />
                </div>
                <div
                  className={`accordion-content ${
                    openAccordionId === user.id ? "open" : ""
                  }`}
                >
                  <div className="details">
                    <div>
                      <p>Age</p>
                      <input
                        style={{
                          border: user.editMode ? "1px solid #ccc" : "none",
                        }}
                        className="age-in"
                        type="number"
                        value={
                          user.editMode ? user.age : calculateAge(user.dob)
                        }
                        readOnly={!user.editMode}
                        onChange={(e) =>
                          setDataWithEditMode((prevData) =>
                            prevData.map((u) =>
                              u.id === user.id
                                ? {
                                    ...u,
                                    age: parseInt(e.target.value),
                                  }
                                : u
                            )
                          )
                        }
                      />
                    </div>
                    <div>
                      <p>Gender</p>

                      {user.editMode ? (
                        <select
                          style={{
                            border: "1px solid #ccc",
                            paddingLeft: "10px",
                          }}
                          value={user.gender}
                          className="gender"
                          onChange={(e) =>
                            setDataWithEditMode((prevData) =>
                              prevData.map((u) =>
                                u.id === user.id
                                  ? {
                                      ...u,
                                      gender: e.target.value,
                                    }
                                  : u
                              )
                            )
                          }
                        >
                          <option>{user.gender}</option>

                          {user.gender === "male" ? (
                            <>
                              <option>female</option>
                              <option>Rather not say</option>
                            </>
                          ) : (
                            <>
                              <option>male</option>
                              <option>Rather not say</option>
                            </>
                          )}
                        </select>
                      ) : (
                        <p style={{ fontSize: "14px" }}>{user.gender}</p>
                      )}
                    </div>
                    <div>
                      <p>Country</p>
                      <input
                        style={{
                          border: user.editMode ? "1px solid #ccc" : "none",
                        }}
                        className="country-in"
                        type="text"
                        value={user.country}
                        readOnly={!user.editMode}
                        onChange={(e) =>
                          setDataWithEditMode((prevData) =>
                            prevData.map((u) =>
                              u.id === user.id
                                ? {
                                    ...u,
                                    country: e.target.value,
                                  }
                                : u
                            )
                          )
                        }
                      />
                    </div>
                  </div>
                  <div className="description">
                    <p>Description</p>
                    <textarea
                      style={{
                        border: user.editMode ? "1px solid #ccc" : "none",
                        outline: "none",
                      }}
                      readOnly={!user.editMode}
                    >
                      {user.description}
                    </textarea>
                    <div className="icons">
                      {!user.editMode && (
                        <FontAwesomeIcon
                          onClick={() => handleDeleteClick(user.id)}
                          style={{
                            color: "red",
                            marginLeft:
                              calculateAge(user.dob) < 18 ? "20px" : "0",
                            cursor: "pointer",
                          }}
                          icon={faTrashCan}
                        />
                      )}
                      {!user.editMode && calculateAge(user.dob) >= 18 && (
                        <FontAwesomeIcon
                          style={{ color: "#4979FF", cursor: "pointer" }}
                          icon={faPencil}
                          onClick={() => toggleEditMode(user.id)}
                        />
                      )}
                    </div>
                  </div>
                  <div className="edit-icons">
                    {user.editMode && (
                      <FontAwesomeIcon
                        style={{ cursor: "pointer" }}
                        className="cross"
                        icon={faCircleXmark}
                        onClick={() => revertChanges(user.id)}
                      />
                    )}
                    {user.editMode && (
                      <FontAwesomeIcon
                        style={{ cursor: "pointer" }}
                        className="correct"
                        icon={faCircleCheck}
                        onClick={() => saveChanges(user.id)}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {itemToDelete !== null && (
        <div className="delete-dialog">
          <div className="delete-text">
            <p>Are you sure you want to delete?</p>
            <FontAwesomeIcon
              onClick={handleCancelDelete}
              style={{ cursor: "pointer", color: "gray", fontSize: "24px" }}
              icon={faXmark}
            />
          </div>

          <div className="delete-btns">
            <button className="cancel-btn" onClick={handleCancelDelete}>
              Cancel
            </button>
            <button
              className="confirm-btn"
              onClick={() => handleConfirmDelete(itemToDelete)}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
