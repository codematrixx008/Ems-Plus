import React, { useState } from 'react';
import FormComponent from '../components/controls/customcomponent/formComponent/components/FormComponent';
// import "./sectionGrid.css"

const EmployeeFormPage = () => {



    return (
        <div className="container">
            <div className="card p-3">
                <FormComponent
                    title="Personal Information"
                    defaultOpen={true}
                />


            </div>
        </div>
    );
};

export default EmployeeFormPage;
