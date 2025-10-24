import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export type Material = {
  id: string
  name: string
  amount: string
  isInCart?: boolean
}

type MaterialAccordionProps = {
  materials: Material[]
}

export const MaterialAccordion = ({ materials }: MaterialAccordionProps) => {
  // const handleAddToCart = (materialId: string) => {
  //   onAddToCart?.(materialId)
  // }

  return (
    <div className="border-b border-gray-200 px-4">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="materials" className="border-b-0">
          <AccordionTrigger className="py-2 hover:no-underline">
            <div className="flex items-center gap-1">
              <span className="text-base font-semibold">재료</span>
              <span className="text-sm text-gray-500">{materials.length}개</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {materials.map(material => (
                <div key={material.id} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-900">{material.name}</span>
                      <span className="text-sm text-gray-500">{material.amount}</span>
                    </div>
                  </div>

                  {/* <button
                    onClick={() => handleAddToCart(material.id)}
                    className={cn(
                      'flex items-center justify-center w-9 h-9 rounded-full border transition-colors',
                      material.isInCart
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-400 text-gray-500 hover:border-gray-600',
                    )}
                    aria-label={`${material.name} 장바구니에 추가`}
                  >
                    <IconShoppingCart className="w-5 h-5" />
                  </button> */}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
