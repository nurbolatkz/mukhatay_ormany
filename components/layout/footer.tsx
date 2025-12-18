import Link from "next/link"
import { Facebook, Instagram, Youtube, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-emerald-600">Mukhatay Ormany</h3>
            <p className="text-sm text-muted-foreground">Реальное лесовосстановление в Казахстане</p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Проект</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#locations" className="text-muted-foreground hover:text-foreground transition-colors">
                  Локации посадки
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                  Как это работает
                </Link>
              </li>
              <li>
                <Link href="#transparency" className="text-muted-foreground hover:text-foreground transition-colors">
                  Отчётность
                </Link>
              </li>
              <li>
                <Link href="#news" className="text-muted-foreground hover:text-foreground transition-colors">
                  Новости
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Для бизнеса</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#corporate" className="text-muted-foreground hover:text-foreground transition-colors">
                  Корпоративное участие
                </Link>
              </li>
              <li>
                <Link href="#corporate" className="text-muted-foreground hover:text-foreground transition-colors">
                  ESG / CSR проекты
                </Link>
              </li>
              <li>
                <Link href="#corporate" className="text-muted-foreground hover:text-foreground transition-colors">
                  Партнёрство
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Email: info@mukhatayormany.kz</li>
              <li>Телефон: +7 (XXX) XXX-XX-XX</li>
              <li>Казахстан, Астана</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Mukhatay Ormany. Все права защищены.</p>
        </div>
      </div>
    </footer>
  )
}
