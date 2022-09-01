import type { NextPage } from 'next'

import { Avatar } from '@jenga-ui/avatar'
import {Block} from '@jenga-ui/core'
import { Accordion } from '@jenga-ui/accordion'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div >

      <h1> hello</h1>
      <Block> and it is this</Block>
      <Avatar> asdf</Avatar>
      <Accordion><span> hi</span></Accordion>
    </div>
  )
}

export default Home
