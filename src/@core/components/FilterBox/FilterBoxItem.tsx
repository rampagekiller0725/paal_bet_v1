import Image from "next/image"

export interface FilterBoxItemProps<T = any> {
  imageUrl: string
  title: string
  value: T
  onClick?: (value: T) => void
}

export default function FilterBoxItem({ imageUrl, title, value, onClick }: FilterBoxItemProps) {
  return (
    <div className="filter-box-item" onClick={() => onClick && onClick(value)}>
      <Image src={imageUrl} className='image' alt='image' width={100} height={100} />
      <span className='title'>{title}</span>
    </div>
  )
}