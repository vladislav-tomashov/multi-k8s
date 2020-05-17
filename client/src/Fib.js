import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const Fib = () => {
  const [seenIndexes, setSeenIndexes] = useState([]);
  const [values, setValues] = useState({});
  const [index, setIndex] = useState("");

  useEffect(() => {
    const fetchValues = async () => {
      const values = await axios.get("/api/values/current");
      // const values = { data: { "1": 1, "2": 1, "3": 2 } };
      setValues(values.data);
    };

    const fetchIndexes = async () => {
      const seenIndexes = await axios.get("/api/values/all");
      // const seenIndexes = { data: [{ number: 1 }, { number: 2 }] };
      setSeenIndexes(seenIndexes.data);
    };

    fetchValues();
    fetchIndexes();
  }, []);

  const renderSeenIndexes = useCallback(() => {
    return seenIndexes.map(({ number }) => number).join(", ");
  }, [seenIndexes]);

  const renderValues = useCallback(() => {
    const entries = [];

    for (let key in values) {
      entries.push(
        <div key={key}>
          For index {key} I calculated {values[key]}
        </div>
      );
    }

    return entries;
  }, [values]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      await axios.post("/api/values", { index });
      setIndex("");
    },
    [index]
  );

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Enter you index:</label>
        <input
          value={index}
          onChange={(event) => setIndex(event.target.value)}
        />
        <button>Submit</button>
      </form>

      <h3>Indexes I have seen:</h3>
      {renderSeenIndexes()}
      <h3>Calculated Values:</h3>
      {renderValues()}
    </div>
  );
};

export default Fib;
