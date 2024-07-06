import React, { useState, useEffect } from "react";
import "./NutritionMeter.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faTrashAlt,
  faUtensils,
  faPlus,
  faMinus,
  faTimes,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const NutritionMeter = () => {
  const defaultItemsDisplayed = [];

  const [nutritionItems, setNutritionItems] = useState(defaultItemsDisplayed);
  const [newItem, setNewItem] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  });

  const [editItem, setEditItem] = useState(null);
  const [totalCalories, setTotalCalories] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [inputError, setInputError] = useState(false);

  const [userDetails, setUserDetails] = useState({
    age: "",
    height: "",
    weight: "",
    gender: "male",
    activityLevel: "sedentary",
  });
  const [recommendations, setRecommendations] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  const [showUserDetails, setShowUserDetails] = useState(false);

  useEffect(() => {
    const calculateTotalCalories = nutritionItems.reduce(
      (total, item) => total + parseFloat(item.calories) * item.quantity,
      0
    );

    setTotalCalories(calculateTotalCalories);

    if (calculateTotalCalories > 1000) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  }, [nutritionItems]);

  const addNutritionItem = () => {
    if (
      newItem.name &&
      newItem.calories >= 0 &&
      newItem.protein >= 0 &&
      newItem.carbs >= 0 &&
      newItem.fat >= 0
    ) {
      setNutritionItems([
        ...nutritionItems,
        { ...newItem, id: Date.now(), quantity: 1 },
      ]);
      setNewItem({
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
      });
      setInputError(false);
    } else {
      setInputError(true);
    }
  };

  const removeAllItems = () => {
    setNutritionItems([]);
  };

  const editItemFunction = (item) => {
    setEditItem(item.id);
    setNewItem({ ...item });
  };

  const updateItemFunction = () => {
    if (
      newItem.name &&
      newItem.calories >= 0 &&
      newItem.protein >= 0 &&
      newItem.carbs >= 0 &&
      newItem.fat >= 0
    ) {
      const updatedItems = nutritionItems.map((item) =>
        item.id === newItem.id ? newItem : item
      );
      setNutritionItems(updatedItems);
      setNewItem({
        name: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
      });
      setEditItem(null);
      setInputError(false);
    } else {
      setInputError(true);
    }
  };

  const deleteItemFunction = (id) => {
    const updatedItems = nutritionItems.filter((item) => item.id !== id);
    setNutritionItems(updatedItems);
  };

  const inputErrorStyle = {
    borderColor: "red",
  };

  const updateItemQuantity = (id, change) => {
    const updatedItems = nutritionItems.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(item.quantity + change, 1) }
        : item
    );
    setNutritionItems(updatedItems);
  };

  const totalProtein = () => {
    return nutritionItems.reduce(
      (total, item) => total + parseFloat(item.protein) * item.quantity,
      0
    );
  };

  const totalCarbs = () => {
    return nutritionItems.reduce(
      (total, item) => total + parseFloat(item.carbs) * item.quantity,
      0
    );
  };

  const totalFat = () => {
    return nutritionItems.reduce(
      (total, item) => total + parseFloat(item.fat) * item.quantity,
      0
    );
  };

  const calculateRecommendations = () => {
    const { age, height, weight, gender, activityLevel } = userDetails;

    let bmr;

    if (gender === "male") {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    let activityFactor;

    switch (activityLevel) {
      case "sedentary":
        activityFactor = 1.2;
        break;
      case "lightly_active":
        activityFactor = 1.375;
        break;
      case "moderately_active":
        activityFactor = 1.55;
        break;
      case "very_active":
        activityFactor = 1.725;
        break;
      case "extra_active":
        activityFactor = 1.9;
        break;
      default:
        activityFactor = 1.2;
    }

    const tdee = bmr * activityFactor;

    setRecommendations({
      calories: Math.round(tdee),
      protein: Math.round((tdee * 0.2) / 4),
      carbs: Math.round((tdee * 0.5) / 4),
      fat: Math.round((tdee * 0.3) / 9),
    });
  };

  useEffect(() => {
    if (userDetails.age && userDetails.height && userDetails.weight) {
      calculateRecommendations();
    }
  }, [userDetails]);

  const pieChartData = [
    { name: "Protein", value: totalProtein() },
    { name: "Carbs", value: totalCarbs() },
    { name: "Fat", value: totalFat() },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="gradient-background">
      <div className="container">
        <h1>Nutrition Meter</h1>
        {showWarning && (
          <div className="warning">
            Total calorie intake is over 1000!
          </div>
        )}
        {inputError && <div className="error-message">Please fill all fields correctly.</div>}
        <div className="theme-toggle">
          <label htmlFor="themeSwitch">Dark Mode</label>
          <input
            type="checkbox"
            id="themeSwitch"
            onChange={(e) => {
              document.body.className = e.target.checked
                ? "dark-theme"
                : "light-theme";
            }}
          />
        </div>
        <div className="dashboard">
          <div>
            <input
              type="text"
              placeholder="Item Name"
              className="input-field"
              value={newItem.name}
              onChange={(e) =>
                setNewItem({ ...newItem, name: e.target.value })
              }
              style={inputError ? inputErrorStyle : {}}
            />
            <input
              type="number"
              placeholder="Calories"
              className="input-field"
              value={newItem.calories}
              onChange={(e) =>
                setNewItem({ ...newItem, calories: parseFloat(e.target.value) })
              }
              style={inputError ? inputErrorStyle : {}}
            />
            <input
              type="number"
              placeholder="Protein (g)"
              className="input-field"
              value={newItem.protein}
              onChange={(e) =>
                setNewItem({ ...newItem, protein: parseFloat(e.target.value) })
              }
              style={inputError ? inputErrorStyle : {}}
            />
            <input
              type="number"
              placeholder="Carbs (g)"
              className="input-field"
              value={newItem.carbs}
              onChange={(e) =>
                setNewItem({ ...newItem, carbs: parseFloat(e.target.value) })
              }
              style={inputError ? inputErrorStyle : {}}
            />
            <input
              type="number"
              placeholder="Fat (g)"
              className="input-field"
              value={newItem.fat}
              onChange={(e) =>
                setNewItem({ ...newItem, fat: parseFloat(e.target.value) })
              }
              style={inputError ? inputErrorStyle : {}}
            />
          </div>
          {editItem ? (
            <button className="edit-button" onClick={updateItemFunction}>
              <FontAwesomeIcon icon={faEdit} /> Update Item
            </button>
          ) : (
            <button className="add-button" onClick={addNutritionItem}>
              <FontAwesomeIcon icon={faUtensils} /> Add Item
            </button>
          )}
          <button className="clear-button" onClick={removeAllItems}>
            <FontAwesomeIcon icon={faTrashAlt} /> Clear All
          </button>
        </div>
        <h2 className="text-center">Items</h2>
        {nutritionItems.map((item) => (
          <div key={item.id} className="item-card">
            <h3>{item.name}</h3>
            <p>Calories: {item.calories}</p>
            <p>Protein: {item.protein}g</p>
            <p>Carbs: {item.carbs}g</p>
            <p>Fat: {item.fat}g</p>
            <div className="quantity-controls">
              <button onClick={() => updateItemQuantity(item.id, -1)}>
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <span>Quantity: {item.quantity}</span>
              <button onClick={() => updateItemQuantity(item.id, 1)}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <button className="edit-button" onClick={() => editItemFunction(item)}>
              <FontAwesomeIcon icon={faEdit} /> Edit
            </button>
            <button className="delete-button" onClick={() => deleteItemFunction(item.id)}>
              <FontAwesomeIcon icon={faTrashAlt} /> Delete
            </button>
          </div>
        ))}
        <div className="total-section">
          <h2>Total Calories: {totalCalories}</h2>
        </div>
        <div className="chart-container">
          <PieChart width={400} height={400}>
            <Pie
              data={pieChartData}
              cx={200}
              cy={200}
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieChartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
        <div className="user-details-toggle">
          <button
            className="toggle-button"
            onClick={() => setShowUserDetails(!showUserDetails)}
          >
            {showUserDetails ? (
              <span>
                Hide User Details <FontAwesomeIcon icon={faChevronUp} />
              </span>
            ) : (
              <span>
                Show User Details <FontAwesomeIcon icon={faChevronDown} />
              </span>
            )}
          </button>
        </div>
        {showUserDetails && (
          <div className="user-details">
            <h2 className="text-center">User Details</h2>
            <input
              type="number"
              placeholder="Age"
              className="input-field"
              value={userDetails.age}
              onChange={(e) =>
                setUserDetails({ ...userDetails, age: parseFloat(e.target.value) })
              }
            />
            <input
              type="number"
              placeholder="Height (cm)"
              className="input-field"
              value={userDetails.height}
              onChange={(e) =>
                setUserDetails({ ...userDetails, height: parseFloat(e.target.value) })
              }
            />
            <input
              type="number"
              placeholder="Weight (kg)"
              className="input-field"
              value={userDetails.weight}
              onChange={(e) =>
                setUserDetails({ ...userDetails, weight: parseFloat(e.target.value) })
              }
            />
            <select
              className="input-field"
              value={userDetails.gender}
              onChange={(e) =>
                setUserDetails({ ...userDetails, gender: e.target.value })
              }
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <select
              className="input-field"
              value={userDetails.activityLevel}
              onChange={(e) =>
                setUserDetails({ ...userDetails, activityLevel: e.target.value })
              }
            >
              <option value="sedentary">Sedentary</option>
              <option value="lightly_active">Lightly Active</option>
              <option value="moderately_active">Moderately Active</option>
              <option value="very_active">Very Active</option>
              <option value="extra_active">Extra Active</option>
            </select>
          </div>
        )}
        <div className="recommendation-section">
          <h2>Daily Recommendations</h2>
          <p>Calories: {recommendations.calories}</p>
          <p>Protein: {recommendations.protein}g</p>
          <p>Carbs: {recommendations.carbs}g</p>
          <p>Fat: {recommendations.fat}g</p>
        </div>
      </div>
    </div>
  );
};

export default NutritionMeter;
