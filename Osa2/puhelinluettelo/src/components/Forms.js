const Forms = ({ query, handleQuery, addNewName, newName, handleAddName, newNumber, handleAddNumber}) => {
    return(
    <>
      <div>filter shown with <input value={query} onChange={handleQuery} /></div>
  
      <form onSubmit={addNewName}>
        <h2>add a new</h2>
        <div>name: <input value={newName} onChange={handleAddName} /></div>
        <div>number: <input value={newNumber} onChange={handleAddNumber} /></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>)
  }

  export default Forms