import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  useMagneticEffect, 
  useRippleEffect, 
  useBreathingEffect, 
  useStaggerReveal 
} from '../../hooks/useMicroInteractions'
import { AccordionComponent } from '../ui/accordion'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { useTranslations } from '../../i18n/ui'
import { Play, Pause, RotateCcw, Heart, Star, Zap, Sparkles } from 'lucide-react'

interface MicroInteractionsShowcaseProps {
  lang?: 'en' | 'fr'
}

export const MicroInteractionsShowcase: React.FC<MicroInteractionsShowcaseProps> = ({ 
  lang = 'en' 
}) => {
  const t = useTranslations(lang)
  const [activeDemo, setActiveDemo] = useState<string | null>(null)

  // Micro-interaction hooks
  const magneticRef = useMagneticEffect<HTMLButtonElement>({ strength: 0.3, threshold: 50 })
  const { triggerRipple, ripples } = useRippleEffect()
  const breathingRef = useBreathingEffect<HTMLDivElement>({ intensity: 1.05, duration: 2000 })
  const { ref: staggerRef, triggerStagger } = useStaggerReveal('.stagger-item', { delay: 0.1 })

  const accordionItems = [
    {
      id: 'magnetic',
      title: t('microInteraction.magnetic'),
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {lang === 'fr' 
              ? "Survolez le bouton ci-dessous pour voir l'effet magnétique en action. Le curseur sera attiré vers le bouton."
              : "Hover over the button below to see the magnetic effect in action. Your cursor will be attracted to the button."
            }
          </p>
          <div className="flex justify-center">
            <Button
              ref={magneticRef}
              variant="outline"
              className="relative overflow-hidden"
              onClick={() => setActiveDemo('magnetic')}
            >
              <Zap className="mr-2 h-4 w-4" />
              {lang === 'fr' ? 'Effet Magnétique' : 'Magnetic Effect'}
            </Button>
          </div>
        </div>
      ),
      icon: <Zap className="h-5 w-5" />,
      ariaLabel: lang === 'fr' ? 'Section effet magnétique' : 'Magnetic effect section'
    },
    {
      id: 'ripple',
      title: t('microInteraction.ripple'),
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {lang === 'fr'
              ? "Cliquez sur la carte ci-dessous pour déclencher un effet d'ondulation qui suit votre curseur."
              : "Click on the card below to trigger a ripple effect that follows your cursor."
            }
          </p>
          <div className="flex justify-center">
            <Card 
              className="relative overflow-hidden cursor-pointer p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-200 dark:border-blue-800"
              onClick={(e) => {
                triggerRipple(e)
                setActiveDemo('ripple')
              }}
            >
              <div className="text-center">
                <Sparkles className="mx-auto mb-2 h-8 w-8 text-blue-500" />
                <p className="font-medium">
                  {lang === 'fr' ? 'Cliquez pour l\'ondulation' : 'Click for Ripple'}
                </p>
              </div>
              {ripples}
            </Card>
          </div>
        </div>
      ),
      icon: <Sparkles className="h-5 w-5" />,
      ariaLabel: lang === 'fr' ? 'Section effet ondulation' : 'Ripple effect section'
    },
    {
      id: 'breathing',
      title: t('microInteraction.breathing'),
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {lang === 'fr'
              ? "L'icône ci-dessous utilise une animation de respiration subtile pour attirer l'attention."
              : "The icon below uses a subtle breathing animation to draw attention."
            }
          </p>
          <div className="flex justify-center">
            <div
              ref={breathingRef}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg"
            >
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
        </div>
      ),
      icon: <Heart className="h-5 w-5" />,
      ariaLabel: lang === 'fr' ? 'Section animation respiration' : 'Breathing animation section'
    },
    {
      id: 'stagger',
      title: t('microInteraction.stagger'),
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {lang === 'fr'
              ? "Cliquez sur le bouton pour voir les éléments apparaître de manière échelonnée."
              : "Click the button to see elements appear in a staggered manner."
            }
          </p>
          <div className="text-center">
            <Button 
              onClick={triggerStagger}
              variant="secondary"
              className="mb-4"
            >
              <Play className="mr-2 h-4 w-4" />
              {lang === 'fr' ? 'Déclencher l\'animation' : 'Trigger Animation'}
            </Button>
          </div>
          <div ref={staggerRef} className="grid grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className="stagger-item h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
              >
                <Star className="h-6 w-6 text-white" />
              </motion.div>
            ))}
          </div>
        </div>
      ),
      icon: <Star className="h-5 w-5" />,
      ariaLabel: lang === 'fr' ? 'Section animation échelonnée' : 'Staggered animation section'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {lang === 'fr' ? 'Démonstration des Micro-Interactions' : 'Micro-Interactions Showcase'}
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {lang === 'fr' 
            ? "Découvrez des animations subtiles et engageantes qui améliorent l'expérience utilisateur sans distraire du contenu."
            : "Explore subtle and engaging animations that enhance user experience without distracting from content."
          }
        </p>
      </motion.div>

      {/* Control Panel */}
      <Card className="p-6">
        <div className="flex flex-wrap gap-4 justify-center items-center">
          <div className="text-sm font-medium text-muted-foreground">
            {lang === 'fr' ? 'Démo active:' : 'Active Demo:'}
          </div>
          <div className="flex gap-2">
            {activeDemo && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-medium"
              >
                {activeDemo}
              </motion.div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveDemo(null)}
            className="text-muted-foreground"
          >
            <RotateCcw className="mr-1 h-3 w-3" />
            {lang === 'fr' ? 'Réinitialiser' : 'Reset'}
          </Button>
        </div>
      </Card>

      {/* Accordion Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <AccordionComponent
          items={accordionItems}
          type="single"
          animated={true}
          collapsible={true}
          aria-label={lang === 'fr' ? 'Démonstration des micro-interactions' : 'Micro-interactions demonstration'}
          onValueChange={(value) => {
            if (typeof value === 'string') {
              setActiveDemo(value || null)
            }
          }}
        />
      </motion.div>

      {/* Performance Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <Card className="p-4 bg-muted/50">
          <p className="text-xs text-muted-foreground">
            {lang === 'fr'
              ? "🚀 Toutes les animations respectent les préférences de mouvement réduit de l'utilisateur et sont optimisées pour les performances."
              : "🚀 All animations respect user's reduced motion preferences and are optimized for performance."
            }
          </p>
        </Card>
      </motion.div>
    </div>
  )
}

export default MicroInteractionsShowcase
