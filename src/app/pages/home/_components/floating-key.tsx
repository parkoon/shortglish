import { IconKeyFilled } from '@tabler/icons-react'

export const FloatingKey = () => {
  return (
    <div className="fixed bottom-[68px] right-3">
      <button className="relative flex items-center justify-center  bg-gray-900 shadow-md text-white rounded-full p-3">
        <IconKeyFilled size={28} />

        <div className="flex items-center justify-center font-bold absolute top-0 right-0 w-5 h-5 bg-primary rounded-full text-xs">
          1
        </div>
      </button>
    </div>
  )
}
