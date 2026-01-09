import Link from "next/link"
import { Facebook, Instagram, Youtube, Send, MessageCircle } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#1a3d2e] text-white/70">
      <div className="container mx-auto px-4 py-12">
        {/* Top Section: 4 columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div>
            <h3 className="font-extrabold text-lg mb-4 text-white">Mukhatay Ormany</h3>
            <p className="text-sm text-white/50 mb-4">Реальное лесовосстановление в Казахстане</p>

          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-white">Быстрые ссылки</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#mission" className="text-white/70 hover:text-primary transition-colors">
                  О проекте
                </Link>
              </li>
              <li>
                <Link href="#locations" className="text-white/70 hover:text-primary transition-colors">
                  Локации
                </Link>
              </li>
              <li>
                <Link href="#corporate" className="text-white/70 hover:text-primary transition-colors">
                  Для компаний
                </Link>
              </li>
              <li>
                <Link href="#contact" className="text-white/70 hover:text-primary transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4 text-white">Правовая информация</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/PrivacyPolicy.pdf" target="_blank" className="text-white/70 hover:text-primary transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/ПУБЛИЧНАЯ ОФЕРТА.pdf" target="_blank" className="text-white/70 hover:text-primary transition-colors">
                  Публичная оферта
                </Link>
              </li>
              <li>
                <Link href="#transparency" className="text-white/70 hover:text-primary transition-colors">
                  Отчеты
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-white">Контакты</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>Email: forest.central.asia@gmail.com</li>
              <li>Телефон: +7 702 999 9849</li>
              <li>Адрес: Товарищество с ограниченной ответственностью «Forest of Central Asia» 021606 Акмолинская область, Шортандинский район, с.о Бозайгыр, ст. Тонкерис, улица Дулатова, 40</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-8"></div>

        {/* Bottom Section */}
        <div className="text-center text-sm text-white/50">
          <p>© {new Date().getFullYear()} Mukhatay Ormany. Все права защищены.</p>
          <p className="mt-2">Made with 🌱 for Kazakhstan</p>
        </div>
      </div>
    </footer>
  )
}
