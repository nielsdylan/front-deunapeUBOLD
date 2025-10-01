
import Customizer from '@/layouts/components/customizer'
import Footer from '@/layouts/components/footer'
import Topbar from '@/layouts/components/topbar'
import type { ChildrenType } from '@/types'
import { Fragment } from 'react'
import ResponsiveNavbar from "@/layouts/components/responsive-navbar";


const HorizontalLayout = ({ children }: ChildrenType) => {
  return (
    <Fragment>
      <div className="wrapper">
        <Topbar />

        <ResponsiveNavbar />

        <div className="content-page">
          {children}

          <Footer />
        </div>
      </div>

      <Customizer />
    </Fragment>
  )
}

export default HorizontalLayout
