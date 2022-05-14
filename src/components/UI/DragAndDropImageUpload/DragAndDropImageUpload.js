import React from 'react'
import Dropzone from 'react-dropzone'

const dragAndDropImageUpload = props => {


    console.log(props.children, "Drag Drop Children")

    const onDrop = (accepted, rejected) => {
         
        if (Object.keys(rejected).length !== 0) {
            //error uploading
        } else {
            props.uploadFile(accepted);
            console.log(accepted[0].preview);
        }
    };

    return (
        <Dropzone onDrop={(acceptedFiles, rejectedFiles) => onDrop(acceptedFiles, rejectedFiles)}>
            {({ getRootProps, getInputProps }) => {
                return (
                    <section>
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            {props.children}
                        </div>
                    </section>
                )
            }}
        </Dropzone>
    )
}

export default dragAndDropImageUpload