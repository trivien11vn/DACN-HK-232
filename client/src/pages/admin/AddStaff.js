import React, { useCallback, useState, useEffect } from 'react';
import { InputForm, Button, Loading, InputFormm } from 'components';
import { useForm } from 'react-hook-form';
import { getBase64 } from 'ultils/helper';
import path from 'ultils/path';
import { toast } from 'react-toastify';
import { apiAddStaff, apiUpdateStaffShift } from 'apis';
import { HashLoader } from 'react-spinners';
import { getCurrent } from 'store/user/asyncAction';
import bgImage from '../../assets/clouds.svg';
import { useDispatch, useSelector } from 'react-redux';
import ManageStaffShift from './ManageStaffShift';
import Swal from 'sweetalert2';
import { useNavigate} from 'react-router-dom';
import { FaPlus, FaSpinner } from 'react-icons/fa';
// const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const AddStaff = () => {
    const { current } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { register, formState: { errors }, reset, handleSubmit, watch } = useForm();
    const [preview, setPreview] = useState({ avatar: null });
    const [isLoading, setIsLoading] = useState(false);
    const [addOfficeHours, setAddOfficeHours] = useState(false);
    const [staffShifts, setStaffShifts] = useState(null);

    useEffect(() => {
        dispatch(getCurrent());
    }, []);

    const handlePreviewAvatar = async (file) => {
        const base64Avatar = await getBase64(file);
        setPreview({ avatar: base64Avatar });
    };

    useEffect(() => {
        handlePreviewAvatar(watch('avatar')[0]);
    }, [watch('avatar')]);

    const handleAddStaff = async (data) => {
        data.provider_id = current?.provider_id?._id;

        // if (staffShifts) {
        //     data.shifts = staffShifts;
        // }

        // removed log

        const formData = new FormData();
        for (let i of Object.entries(data)) {
            formData.append(i[0], i[1]);
        }
        if (!current?.provider_id) {
            toast.error('No Provider Specified With Current User!!');
            return;
        }

        formData.delete('avatar');
        if (data.avatar) formData.append('avatar', data.avatar[0]);

        // removed log
        // // removed log

        setIsLoading(true);
        const response = await apiAddStaff(formData);

        if (response.success && response.staff) {
            let resp = await apiUpdateStaffShift({staffId: response.staff?._id, newShifts:staffShifts});

            if (resp.success) {
                toast.success('Created staff successfully');
            }
            else {
                let swalResult = await Swal.fire({
                    title: "Staff Created Success - Failed To Update Shift",
                    text: 'Staff shift cannot updated as it violated working Hours of providers, you can resolve in Manage Staff menu!',
                    icon: 'warning',
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: 'Confirm'           
                });

                if (swalResult.isConfirmed) {
                    navigate({
                        pathname: `/${path.ADMIN}/${path.MANAGE_STAFF}`
                    })
                }
            }
        } else {
            toast.error("Error Create Staff!");
        }
        setIsLoading(false);
    };

    return (
        <div className='w-full h-full relative'>
        <div className='inset-0 absolute z-0'>
          <img src={bgImage} className='w-full h-full object-cover'/>
        </div>
        <div className='relative z-10 w-full'>
          <div className='w-full h-fit flex justify-between p-4'>
            <span className='text-[#00143c] text-3xl h-fit font-semibold'>Add Staff</span>
          </div>

          { addOfficeHours && <ManageStaffShift staffId={null}
                        setManageStaffShift={setAddOfficeHours}
                        parentHandleSubmitStaffShift={setStaffShifts}/> }

            <div className='p-4 '>
                <form onSubmit={handleSubmit(handleAddStaff)}>
                    <div className='w-full my-6 flex gap-4'>

                        <InputFormm
                            label='First Name'
                            register={register}
                            errors={errors}
                            id='firstName'
                            validate={{
                                required: 'Need fill this field'
                            }}
                            style='flex-auto'
                            placeholder='First Name ...'
                            styleLabel={'text-[#00143c] font-medium mb-1'}
                            styleInput={'w-full px-4 py-2 border text-[#00143c] outline-none rounded-md border-[#dee1e6]'}
                        />

                        <InputFormm
                            label='Last Name'
                            register={register}
                            errors={errors}
                            id='lastName'
                            validate={{
                                required: 'Need fill this field'
                            }}
                            style='flex-auto'
                            placeholder='First Name ...'
                            styleLabel={'text-[#00143c] font-medium mb-1'}
                            styleInput={'w-full px-4 py-2 border text-[#00143c] outline-none rounded-md border-[#dee1e6]'}
                        />

                    </div>
                    <div className='w-full my-6 flex gap-4'>
                        <InputFormm
                            label='Email Address'
                            register={register}
                            errors={errors}
                            id='email'
                            validate={{
                                required: 'Require fill', 
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "invalid email address"
                                }
                            }} 
                            style='flex-auto'
                            placeholder='Email Address ...'
                            styleLabel={'text-[#00143c] font-medium mb-1'}
                            styleInput={'w-full px-4 py-2 border text-[#00143c] outline-none rounded-md border-[#dee1e6]'}
                        />
                        <InputFormm
                            label='Phone Number'
                            register={register}
                            errors={errors}
                            id='mobile'
                            validate={{
                                required: 'Require fill', 
                                pattern: {
                                    value: /^((\+)33|0)[1-9](\d{2}){4}$/,
                                    message: "invalid phone number"
                                }
                            }} 
                            style='flex-auto'
                            placeholder='Phone Number ...'
                            styleLabel={'text-[#00143c] font-medium mb-1'}
                            styleInput={'w-full px-4 py-2 border text-[#00143c] outline-none rounded-md border-[#dee1e6]'}
                        />
                    </div>
                    <div className='flex justify-between gap-4 mt-8 text-gray-600'>
                        <div className='flex flex-col gap-2'>
                            <label className='font-semibold' htmlFor='avatar'>Upload Avatar</label>
                            <input 
                                {...register('avatar', {required: 'Need upload avatar'})}
                                type='file' 
                                id='avatar'
                                accept="image/*"
                            />
                            {errors['avatar'] && <small className='text-base text-red-500'>{errors['avatar']?.message}</small>}
                        </div>

                        <div>
                            <Button handleOnclick={() => { setAddOfficeHours(true); }}>
                                Add Shift for this Staff
                            </Button>
                        </div>
                    </div>
                    {preview.avatar && (
                        <div className='my-4'>
                            <img src={preview.avatar} alt='avatar' className='w-[200px] object-contain' />
                        </div>
                    )}

                    <div className='mt-8'>
                    <button disabled={isLoading} type='submit' className={'px-4 py-2 rounded-md text-white bg-[#005aee] font-semibold w-fit h-fit flex gap-1 items-center disabled:opacity-50 disabled:cursor-not-allowed'}>
                        {isLoading ? (
                            <span className="flex items-center">
                            <FaSpinner className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                            Adding staff...
                            </span>
                        ) : (
                            <span className='flex items-center'>
                            <FaPlus /> Add staff
                            </span>
                        )}
                    </button>
                    </div>
                </form>
            </div>
        </div>
        </div>
    );
};

export default AddStaff;
