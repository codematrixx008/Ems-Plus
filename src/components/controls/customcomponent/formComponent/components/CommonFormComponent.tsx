import React, { useState } from 'react'


type FormColumn = {
    Id: number
    ColumnName: string
    DbDataType: string
    ComponentType: string
    IsRequired: boolean
    Length: number
    Placeholder: string
    DropdownId: number
    IsHidden: boolean
    IsEnabled: boolean
    IsForSectionGrid: boolean
    IsForSearch: boolean
    IsEditablePopup: boolean
    TabIds: number[] | null
    AllowMultiSelectSearch: boolean
}

type Props = {
    formColumnsArray: FormColumn[]
     onSubmit: (data: Record<string, any>) => void
     useFormControls?: boolean
}

const CommonFormComponent = ({ formColumnsArray, onSubmit, useFormControls }: Props) => {
    const initialFormState = formColumnsArray.reduce((acc, col) => {
        acc[col.ColumnName] = col.ComponentType === 'Checkbox' ? false : ''
        return acc
    }, {} as Record<string, any>)

    const [formData, setFormData] = useState<Record<string, any>>(initialFormState)

    const handleChange = (name: string, value: any) => {
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

   
    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData) // send data to parent
    }

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            {formColumnsArray.map((col) => {
                switch (col.ComponentType) {
                    case 'Textbox':
                        return (
                            <>
                                <BsInputControl
                                    id="name"
                                    label={col.ColumnName}
                                    placeholder={col.Placeholder}
                                    value={formData[col.ColumnName]}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleChange(col.ColumnName, e.target.value)
                                    }
                                />

                            </>
                        )

                    case 'CurrencyTextbox':
                        return (
                            <BsNumberInputControl
                                key={col.Id}
                                id={col.ColumnName}
                                label={col.ColumnName}
                                placeholder={col.Placeholder}
                                min={0}
                                step={1}
                                required={col.IsRequired}
                                value={formData[col.ColumnName]}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    handleChange(col.ColumnName, e.target.value)
                                }
                            />
                        )

                    case 'DatePicker':
                        return (
                            <BsDateInputControl
                                key={col.Id}
                                id={col.ColumnName}
                                label={col.ColumnName}
                                placeholder={col.Placeholder}
                                required={col.IsRequired}
                                value={formData[col.ColumnName]}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    handleChange(col.ColumnName, e.target.value)
                                }
                            />
                        )

                    case 'Dropdown':
                        return (
                            <BsSelectControl
                                key={col.Id}
                                id={col.ColumnName}
                                label={col.ColumnName}
                                options={[]} // dynamic options can be passed here
                                required={col.IsRequired}
                                value={formData[col.ColumnName]}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    handleChange(col.ColumnName, e.target.value)
                                }
                            />
                        )

                    case 'Checkbox':
                        return (
                            <BsCheckboxControl
                                key={col.Id}
                                id={col.ColumnName}
                                required={col.IsRequired}
                                checked={formData[col.ColumnName]}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    handleChange(col.ColumnName, e.target.value)
                                }
                            >
                                {col.ColumnName}
                            </BsCheckboxControl>
                        )

                    default:
                        return null
                }
            })}
            {useFormControls && 
            <div className="pt-4 flex justify-end gap-3">
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
                <button type="button" className="btn btn-danger">
                    Delete
                </button>
            </div>
            }
        </form>
    )
}

export default CommonFormComponent
