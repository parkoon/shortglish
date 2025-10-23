import { IconHeart } from '@tabler/icons-react'

const Likes = () => (
  <div>
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Likes</h1>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(item => (
          <div
            key={item}
            className="p-4 bg-gray-50 rounded-lg flex items-center justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <IconHeart className="w-5 h-5 text-pink-500 fill-pink-500" />
              <div>
                <p className="font-medium">Post #{item}</p>
                <p className="text-sm text-gray-500">좋아요 {100 * item}개</p>
              </div>
            </div>
            <span className="text-xs text-gray-400">2시간 전</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export const Component = Likes
