import React, { useState, useCallback } from 'react'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/utils'

interface AccordionItem {
  id: string
  title: string
  content: string | React.ReactNode
  icon?: React.ReactNode
  ariaLabel?: string
  disabled?: boolean
}

interface AccordionComponentProps {
  items: AccordionItem[]
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  className?: string
  animated?: boolean
  collapsible?: boolean
  orientation?: 'horizontal' | 'vertical'
  onValueChange?: (value: string | string[]) => void
  'aria-label'?: string
  'aria-labelledby'?: string
}

export const AccordionComponent: React.FC<AccordionComponentProps> = ({
  items,
  type = 'single',
  defaultValue,
  className,
  animated = true,
  collapsible = true,
  orientation = 'vertical',
  onValueChange,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [openItems, setOpenItems] = useState<string[]>(
    defaultValue 
      ? Array.isArray(defaultValue) 
        ? defaultValue 
        : [defaultValue]
      : []
  )

  const handleValueChange = useCallback((value: string | string[]) => {
    const newValue = Array.isArray(value) ? value : value ? [value] : []
    setOpenItems(newValue)
    onValueChange?.(value)
  }, [onValueChange])

  const isItemOpen = useCallback((itemId: string) => {
    return openItems.includes(itemId)
  }, [openItems])

  const triggerVariants = {
    closed: { 
      scale: 1,
      backgroundColor: 'transparent',
      borderColor: 'hsl(var(--border))',
    },
    open: { 
      scale: 1.02,
      backgroundColor: 'hsl(var(--accent) / 0.1)',
      borderColor: 'hsl(var(--accent))',
    },
    hover: {
      scale: 1.01,
      backgroundColor: 'hsl(var(--muted))',
      borderColor: 'hsl(var(--accent) / 0.5)',
    }
  }

  const contentVariants = {
    closed: {
      height: 0,
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.3,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
    open: {
      height: 'auto',
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
  }

  const iconVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 },
  }

  const glowVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.8,
      filter: 'blur(4px)',
    },
    visible: {
      opacity: 0.6,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
  }

  return (
    <>
      {type === 'single' ? (
        <Accordion.Root
          type="single"
          defaultValue={typeof defaultValue === 'string' ? defaultValue : Array.isArray(defaultValue) ? defaultValue[0] : undefined}
          collapsible={collapsible}
          orientation={orientation}
          onValueChange={handleValueChange}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          className={cn(
            'w-full space-y-4',
            className
          )}
        >
          {renderItems()}
        </Accordion.Root>
      ) : (
        <Accordion.Root
          type="multiple"
          defaultValue={Array.isArray(defaultValue) ? defaultValue : defaultValue ? [defaultValue] : undefined}
          orientation={orientation}
          onValueChange={handleValueChange}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          className={cn(
            'w-full space-y-4',
            className
          )}
        >
          {renderItems()}
        </Accordion.Root>
      )}
    </>
  )

  function renderItems() {
    return items.map((item) => (
        <Accordion.Item
          key={item.id}
          value={item.id}
          disabled={item.disabled}
          className="relative group"
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          {/* Glow effect on hover */}
          <AnimatePresence>
            {hoveredItem === item.id && (
              <motion.div
                variants={glowVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="absolute -inset-2 bg-gradient-to-r from-accent/20 via-primary/20 to-accent/20 rounded-xl blur-lg pointer-events-none"
                aria-hidden="true"
              />
            )}
          </AnimatePresence>

          <motion.div
            className="relative bg-card border border-border rounded-lg overflow-hidden backdrop-blur-sm"
            variants={animated ? triggerVariants : undefined}
            initial="closed"
            whileHover="hover"
            animate={hoveredItem === item.id ? "hover" : "closed"}
          >
            <Accordion.Trigger
              className={cn(
                'flex w-full items-center justify-between p-6 text-left',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
                'transition-all duration-200 ease-out',
                'group/trigger',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              aria-label={item.ariaLabel || `Toggle ${item.title} section`}
              aria-expanded={isItemOpen(item.id)}
              disabled={item.disabled}
            >
              <div className="flex items-center gap-4">
                {item.icon && (
                  <motion.div
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 text-accent"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.icon}
                  </motion.div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-foreground group-hover/trigger:text-accent transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>

              <motion.div
                className="flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 text-accent"
                variants={animated ? iconVariants : undefined}
                animate={isItemOpen(item.id) ? 'open' : 'closed'}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-hidden="true"
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </Accordion.Trigger>

            <Accordion.Content asChild>
              <motion.div
                variants={animated ? contentVariants : undefined}
                initial="closed"
                animate={isItemOpen(item.id) ? "open" : "closed"}
                className="overflow-hidden"
                role="region"
                aria-labelledby={`trigger-${item.id}`}
              >
                <div className="px-6 pb-6 pt-2 text-muted-foreground leading-relaxed">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    {typeof item.content === 'string' ? (
                      <p>{item.content}</p>
                    ) : (
                      item.content
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </Accordion.Content>
          </motion.div>
        </Accordion.Item>
      ))
  }
}

export default AccordionComponent
