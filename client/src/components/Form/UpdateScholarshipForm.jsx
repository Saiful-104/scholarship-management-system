import { useForm } from 'react-hook-form'
import { imageUpload } from '../../utils'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useEffect } from 'react'
import useAxiosSecure from '../../hooks/useAxiosSecure'
import { 
  Upload, 
  Building2, 
  Globe2, 
  MapPin, 
  Award, 
  BookOpen, 
  GraduationCap, 
  DollarSign, 
  Calendar,
  Loader2,
  Sparkles
} from 'lucide-react'

const UpdateScholarshipForm = ({ scholarship, closeModal }) => {
  const axiosSecure = useAxiosSecure()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm()
  const image = watch("image")

  useEffect(() => {
    if (scholarship) {
      reset({
        scholarshipName: scholarship.scholarshipName || '',
        universityName: scholarship.universityName || '',
        universityCountry: scholarship.universityCountry || '',
        universityCity: scholarship.universityCity || '',
        universityWorldRank: scholarship.universityWorldRank || '',
        subjectCategory: scholarship.subjectCategory || '',
        scholarshipCategory: scholarship.scholarshipCategory || 'Full fund',
        degree: scholarship.degree || 'Bachelor',
        tuitionFees: scholarship.tuitionFees || '',
        applicationFees: scholarship.applicationFees || '',
        serviceCharge: scholarship.serviceCharge || '',
        applicationDeadline: scholarship.applicationDeadline ? scholarship.applicationDeadline.split('T')[0] : '',
        scholarshipPostDate: scholarship.scholarshipPostDate ? scholarship.scholarshipPostDate.split('T')[0] : '',
      })
    }
  }, [scholarship, reset])

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await axiosSecure.put(`/scholarships/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-scholarships'])
      toast.success('🎉 Scholarship updated successfully!')
      closeModal()
    },
    onError: (error) => {
      console.log(error)
      toast.error('❌ Failed to update scholarship')
    },
  })

  const onSubmit = async (data) => {
    const {
      scholarshipName,
      universityName,
      universityCountry,
      universityCity,
      universityWorldRank,
      subjectCategory,
      scholarshipCategory,
      degree,
      tuitionFees,
      applicationFees,
      serviceCharge,
      applicationDeadline,
      scholarshipPostDate,
      image,
    } = data

    try {
      let imageUrl = scholarship.universityImage
      if (image && image[0]) {
        const toastId = toast.loading('Uploading image...')
        imageUrl = await imageUpload(image[0])
        toast.dismiss(toastId)
      }

      const scholarshipData = {
        scholarshipName,
        universityName,
        universityImage: imageUrl,
        universityCountry,
        universityCity,
        universityWorldRank: Number(universityWorldRank) || 0,
        subjectCategory,
        scholarshipCategory,
        degree,
        tuitionFees: tuitionFees ? Number(tuitionFees) : 0,
        applicationFees: Number(applicationFees),
        serviceCharge: serviceCharge ? Number(serviceCharge) : 0,
        applicationDeadline,
        scholarshipPostDate: scholarshipPostDate || new Date().toISOString(),
      }

      updateMutation.mutate({
        id: scholarship._id,
        data: scholarshipData
      })
    } catch (err) {
      console.log(err)
      toast.error('❌ Error updating scholarship')
    }
  }

  const scholarshipCategories = [
    { value: 'Full fund', label: 'Full Fund', color: 'bg-green-100 text-green-800' },
    { value: 'Partial', label: 'Partial', color: 'bg-blue-100 text-blue-800' },
    { value: 'Self-fund', label: 'Self Fund', color: 'bg-purple-100 text-purple-800' }
  ]

  const degreeOptions = [
    { value: 'Diploma', label: 'Diploma' },
    { value: 'Bachelor', label: 'Bachelor' },
    { value: 'Masters', label: 'Masters' },
    { value: 'PhD', label: 'PhD' }
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        
        {/* Left Column - Basic Information */}
        <div className='space-y-6'>
          {/* Section Header */}
          <div className='flex items-center space-x-3 pb-4 border-b border-gray-200'>
            <div className='p-2 bg-blue-50 rounded-lg'>
              <Award className='w-5 h-5 text-blue-600' />
            </div>
            <div>
              <h3 className='font-semibold text-gray-900'>Basic Information</h3>
              <p className='text-sm text-gray-500'>Core scholarship details</p>
            </div>
          </div>

          {/* Scholarship Name */}
          <div className='space-y-2'>
            <label htmlFor='scholarshipName' className='flex items-center space-x-2 text-sm font-medium text-gray-700'>
              <Sparkles className='w-4 h-4 text-blue-500' />
              <span>Scholarship Name *</span>
            </label>
            <div className='relative'>
              <input
                className='w-full px-4 py-3 pl-11 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white'
                id='scholarshipName'
                type='text'
                placeholder='Enter scholarship name'
                {...register('scholarshipName', {
                  required: 'Scholarship name is required',
                })}
              />
              <Award className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
            </div>
            {errors.scholarshipName && (
              <p className='text-sm text-red-500 mt-1 flex items-center space-x-1'>
                <span>⚠️</span>
                <span>{errors.scholarshipName.message}</span>
              </p>
            )}
          </div>

          {/* University Details */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* University Name */}
            <div className='space-y-2'>
              <label htmlFor='universityName' className='flex items-center space-x-2 text-sm font-medium text-gray-700'>
                <Building2 className='w-4 h-4 text-blue-500' />
                <span>University Name *</span>
              </label>
              <div className='relative'>
                <input
                  className='w-full px-4 py-3 pl-11 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white'
                  id='universityName'
                  type='text'
                  placeholder='University name'
                  {...register('universityName', {
                    required: 'University name is required',
                  })}
                />
                <Building2 className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
              </div>
              {errors.universityName && (
                <p className='text-sm text-red-500 mt-1'>{errors.universityName.message}</p>
              )}
            </div>

            {/* World Rank */}
            <div className='space-y-2'>
              <label htmlFor='universityWorldRank' className='flex items-center space-x-2 text-sm font-medium text-gray-700'>
                <Globe2 className='w-4 h-4 text-blue-500' />
                <span>World Rank</span>
              </label>
              <div className='relative'>
                <input
                  className='w-full px-4 py-3 pl-11 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white'
                  id='universityWorldRank'
                  type='number'
                  placeholder='Enter rank'
                  {...register('universityWorldRank')}
                />
                <Globe2 className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Country */}
            <div className='space-y-2'>
              <label htmlFor='universityCountry' className='flex items-center space-x-2 text-sm font-medium text-gray-700'>
                <MapPin className='w-4 h-4 text-blue-500' />
                <span>Country *</span>
              </label>
              <div className='relative'>
                <input
                  className='w-full px-4 py-3 pl-11 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white'
                  id='universityCountry'
                  type='text'
                  placeholder='Country'
                  {...register('universityCountry', {
                    required: 'Country is required',
                  })}
                />
                <MapPin className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
              </div>
              {errors.universityCountry && (
                <p className='text-sm text-red-500 mt-1'>{errors.universityCountry.message}</p>
              )}
            </div>

            {/* City */}
            <div className='space-y-2'>
              <label htmlFor='universityCity' className='flex items-center space-x-2 text-sm font-medium text-gray-700'>
                <MapPin className='w-4 h-4 text-blue-500' />
                <span>City</span>
              </label>
              <div className='relative'>
                <input
                  className='w-full px-4 py-3 pl-11 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white'
                  id='universityCity'
                  type='text'
                  placeholder='City'
                  {...register('universityCity')}
                />
                <MapPin className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
              </div>
            </div>
          </div>

          {/* Subject Category */}
          <div className='space-y-2'>
            <label htmlFor='subjectCategory' className='flex items-center space-x-2 text-sm font-medium text-gray-700'>
              <BookOpen className='w-4 h-4 text-blue-500' />
              <span>Subject Category *</span>
            </label>
            <div className='relative'>
              <input
                className='w-full px-4 py-3 pl-11 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white'
                id='subjectCategory'
                type='text'
                placeholder='e.g., Computer Science, Business, Engineering'
                {...register('subjectCategory', {
                  required: 'Subject category is required',
                })}
              />
              <BookOpen className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
            </div>
            {errors.subjectCategory && (
              <p className='text-sm text-red-500 mt-1'>{errors.subjectCategory.message}</p>
            )}
          </div>
        </div>

        {/* Right Column - Financial & Additional Info */}
        <div className='space-y-6'>
          {/* Section Header */}
          <div className='flex items-center space-x-3 pb-4 border-b border-gray-200'>
            <div className='p-2 bg-green-50 rounded-lg'>
              <DollarSign className='w-5 h-5 text-green-600' />
            </div>
            <div>
              <h3 className='font-semibold text-gray-900'>Financial & Academic Details</h3>
              <p className='text-sm text-gray-500'>Funding and degree information</p>
            </div>
          </div>

          {/* Scholarship Category */}
          <div className='space-y-2'>
            <label htmlFor='scholarshipCategory' className='flex items-center space-x-2 text-sm font-medium text-gray-700'>
              <Award className='w-4 h-4 text-blue-500' />
              <span>Scholarship Category *</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {scholarshipCategories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => setValue('scholarshipCategory', category.value)}
                  className={`px-4 py-3 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center space-y-1 ${
                    watch('scholarshipCategory') === category.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                    {category.label}
                  </span>
                  <input
                    type="radio"
                    className="hidden"
                    {...register('scholarshipCategory', {
                      required: 'Scholarship category is required',
                    })}
                    value={category.value}
                  />
                </button>
              ))}
            </div>
            {errors.scholarshipCategory && (
              <p className='text-sm text-red-500 mt-1'>{errors.scholarshipCategory.message}</p>
            )}
          </div>

          {/* Degree Selection */}
          <div className='space-y-2'>
            <label htmlFor='degree' className='flex items-center space-x-2 text-sm font-medium text-gray-700'>
              <GraduationCap className='w-4 h-4 text-blue-500' />
              <span>Degree *</span>
            </label>
            <div className="relative">
              <select
                className='w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-gray-50/50 hover:bg-white transition-all duration-200'
                id='degree'
                {...register('degree', {
                  required: 'Degree is required',
                })}
              >
                {degreeOptions.map((degree) => (
                  <option key={degree.value} value={degree.value}>
                    {degree.label}
                  </option>
                ))}
              </select>
              <GraduationCap className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {errors.degree && (
              <p className='text-sm text-red-500 mt-1'>{errors.degree.message}</p>
            )}
          </div>

          {/* Financial Details */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {/* Tuition Fees */}
            <div className='space-y-2'>
              <label htmlFor='tuitionFees' className='flex items-center space-x-2 text-sm font-medium text-gray-700'>
                <DollarSign className='w-4 h-4 text-blue-500' />
                <span>Tuition Fees</span>
              </label>
              <div className='relative'>
                <input
                  className='w-full px-4 py-3 pl-11 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white'
                  id='tuitionFees'
                  type='number'
                  placeholder='0.00'
                  {...register('tuitionFees')}
                />
                <DollarSign className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
              </div>
            </div>

            {/* Application Fees */}
            <div className='space-y-2'>
              <label htmlFor='applicationFees' className='flex items-center space-x-2 text-sm font-medium text-gray-700'>
                <DollarSign className='w-4 h-4 text-blue-500' />
                <span>App Fees *</span>
              </label>
              <div className='relative'>
                <input
                  className='w-full px-4 py-3 pl-11 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white'
                  id='applicationFees'
                  type='number'
                  placeholder='0.00'
                  {...register('applicationFees', {
                    required: 'Application fees is required',
                    min: { value: 0, message: 'Fees must be positive' },
                  })}
                />
                <DollarSign className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
              </div>
              {errors.applicationFees && (
                <p className='text-sm text-red-500 mt-1'>{errors.applicationFees.message}</p>
              )}
            </div>

            {/* Service Charge */}
            <div className='space-y-2'>
              <label htmlFor='serviceCharge' className='flex items-center space-x-2 text-sm font-medium text-gray-700'>
                <DollarSign className='w-4 h-4 text-blue-500' />
                <span>Service Charge</span>
              </label>
              <div className='relative'>
                <input
                  className='w-full px-4 py-3 pl-11 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white'
                  id='serviceCharge'
                  type='number'
                  placeholder='0.00'
                  {...register('serviceCharge')}
                />
                <DollarSign className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* Application Deadline */}
            <div className='space-y-2'>
              <label htmlFor='applicationDeadline' className='flex items-center space-x-2 text-sm font-medium text-gray-700'>
                <Calendar className='w-4 h-4 text-blue-500' />
                <span>Deadline *</span>
              </label>
              <div className='relative'>
                <input
                  className='w-full px-4 py-3 pl-11 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white'
                  id='applicationDeadline'
                  type='date'
                  {...register('applicationDeadline', {
                    required: 'Application deadline is required',
                  })}
                />
                <Calendar className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
              </div>
              {errors.applicationDeadline && (
                <p className='text-sm text-red-500 mt-1'>{errors.applicationDeadline.message}</p>
              )}
            </div>

            {/* Post Date */}
            <div className='space-y-2'>
              <label htmlFor='scholarshipPostDate' className='flex items-center space-x-2 text-sm font-medium text-gray-700'>
                <Calendar className='w-4 h-4 text-blue-500' />
                <span>Post Date</span>
              </label>
              <div className='relative'>
                <input
                  className='w-full px-4 py-3 pl-11 text-gray-800 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white'
                  id='scholarshipPostDate'
                  type='date'
                  {...register('scholarshipPostDate')}
                />
                <Calendar className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className='space-y-2'>
            <label className='flex items-center space-x-2 text-sm font-medium text-gray-700'>
              <Upload className='w-4 h-4 text-blue-500' />
              <span>University Image</span>
            </label>
            <div className={`relative border-2 border-dashed rounded-2xl transition-all duration-300 hover:border-blue-400 hover:bg-blue-50/50 ${
              image && image.length > 0 
                ? 'border-green-400 bg-green-50/50' 
                : 'border-gray-300 bg-gray-50/50'
            }`}>
              <div className='p-8 text-center'>
                <div className='flex flex-col items-center space-y-4'>
                  <div className={`p-4 rounded-full ${
                    image && image.length > 0 
                      ? 'bg-green-100' 
                      : 'bg-blue-100'
                  }`}>
                    <Upload className={`w-8 h-8 ${
                      image && image.length > 0 
                        ? 'text-green-600' 
                        : 'text-blue-600'
                    }`} />
                  </div>
                  <div>
                    <label className="cursor-pointer">
                      <input
                        className='hidden'
                        type='file'
                        id='image'
                        accept='image/*'
                        {...register('image')}
                      />
                      <span className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow">
                        {image && image.length > 0 ? 'Change Image' : 'Upload Image'}
                      </span>
                    </label>
                    <p className="mt-2 text-sm text-gray-500">
                      PNG, JPG, WEBP up to 5MB
                    </p>
                  </div>
                  {image && image.length > 0 && (
                    <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-200 flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-700 font-medium">New image selected</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className='mt-10 pt-6 border-t border-gray-200 flex justify-end space-x-4'>
        <button
          type='button'
          onClick={closeModal}
          className='px-8 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2'
        >
          Cancel
        </button>
        <button
          type='submit'
          disabled={updateMutation.isPending}
          className='px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow disabled:opacity-70 disabled:cursor-not-allowed flex items-center space-x-2'
        >
          {updateMutation.isPending ? (
            <>
              <Loader2 className='w-5 h-5 animate-spin' />
              <span>Updating...</span>
            </>
          ) : (
            <>
              <Sparkles className='w-5 h-5' />
              <span>Update Scholarship</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default UpdateScholarshipForm