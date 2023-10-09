const handleModifyClick = (index) => {
    setEditModes((prevModes) => ({
        ...prevModes,
        [index]: true,
    }));

    // Store the current data in editedData state
    const currentData = currentBrokerData[index];
    setEditedData((prevData) => ({
        ...prevData,
        [index]: { ...currentData },
    }));
};

const handleInputChange = (index, field, value) => {
    setEditedData((prevData) => ({
        ...prevData,
        [index]: {
            ...prevData[index],
            [field]: value,
        },
    }));
};

const handleFilter = (filter) => {
    dispatch(setFilter(filter));
};