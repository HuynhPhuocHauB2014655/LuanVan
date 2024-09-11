import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import axiosClient from "../axios-client";
export default function TestFileUpload() {
    const [img, setImg] = useState();
    const getFile = async () => {
        const response = await axiosClient.get(`/file`);
        try{
            const image = await axiosClient.get(`/file/${response.data.FileName}`,{
                responseType: 'blob',
            });
            setImg(URL.createObjectURL(image.data));
        }catch(error){
            console.log(error);
        }
    }
    useEffect(()=>{
        getFile();
    },[]);
    const uploadFile = async (value) => {
        const f = value.file;
        const fd = new FormData();
        fd.append('file', f);
        const config = {
            headers: {
              "content-type": "multipart/form-data",
            },
          };
        try{
            const res = axiosClient.post("/file",fd,config);
            console.log(res.data);
        }catch(error){
            console.log(error);
        }
    }
    return (
        <div>
            {img ? 
                <img src={img} alt="uploaded image"/>
                :
                <p>No image uploaded</p>
            }
            <Formik
                initialValues={{
                    file: null,
                }}
                onSubmit={uploadFile}
            >
                {({ setFieldValue, values }) => (
                    <Form>
                        <input
                            type="file"
                            name="file"
                            onChange={(event) => {
                                setFieldValue('file', event.currentTarget.files[0]);
                            }}
                        />
                        <button type="submit">Lưu</button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}