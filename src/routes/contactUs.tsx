import React, { useRef } from "react";
import DefaultLayout from "../layout/DefaultLayout";
import emailjs from '@emailjs/browser';
import '../routes/contac.css'

const ContactUs = () => {
  const refForm = useRef(""); 
  
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(refForm.current);

    const serviceId = "service_gqus8q5";
    const templateId = "template_omhxrhn";
    const apiKey = "iZMvQhyKKBv8VUH6F";
    emailjs
      .sendForm(serviceId, templateId, refForm.current, apiKey)
      .then(result => console.log(result.text))
      .catch(error => console.log(error));
  };

  return (
    <div>
      <DefaultLayout>
        <form ref={refForm} action="" onSubmit={handleSubmit}>
          <div className="header-contact">
          <p>Please fill from </p>
          <fieldset className="field-name">
            <label className="symbol-required name" htmlFor="">name</label>
           < input type="text" placeholder="Ej: Luisa"></input>
          </fieldset>
          </div>
          <button className="btn-send">Enviar</button>
        </form>
      </DefaultLayout>
    </div>
  );
};

export default ContactUs;
