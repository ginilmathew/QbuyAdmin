import React, { useState } from 'react'

const TagInput = ({ tagValues, values, close }) => {
    // console.log({close})
    const [tags, setTags] = useState(values ? [...values] : [])
    const [value, setValue] = useState('')
    // console.log({tags})
    const submitvalues = (e) => {

        if (tags.includes(e.target.value)) {
            return false
        }
        let modifiedString = e.target.value?.split(" ").join("-");
        if (e.target.value?.length >= 1 && modifiedString) {

            if (e.key === 'Enter') {
                setTags((prev) => {
                    tagValues([...prev, modifiedString])
                    return [...prev, modifiedString]
                })
                setValue('')
            }
        }
    }
    const changeValues = (e) => {
        setValue(e.target.value);
    }


    const removeTag = (index) => {
        let tagas = tags.filter((tag, i) => i !== index);
        tagValues([...tagas])
        setTags(tagas)
    }

    return (
        <div style={{ border: '0.5px solid black', minHeight: 30, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
            <input
                type='text'
                value={value}
                onChange={changeValues}
                onKeyDown={submitvalues}
                placeholder='Options'
                style={{ height: 30, margin: 5, minWidth: 100, border: '0.2px solid gray' }}
            />
            {tags?.map((tag, index) => <div key={index} style={{ backgroundColor: '#ebf0f7', padding: 5, margin: 2, display: 'flex', flexDirection: 'row', height: 30, fontSize: 12, alignItems: 'center' }}>
                <span>{tag}</span>
                {close &&
                    <span style={{ marginLeft: 5, marginRight: 5, color: 'red', cursor: 'pointer' }} onClick={() => removeTag(index)} >X</span>}
            </div>)}
        </div>
    )
}

export default TagInput