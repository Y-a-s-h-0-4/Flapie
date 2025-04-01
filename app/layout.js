import '../styles/globals.css';
import Nav from '@components/Nav';
import Provider from '@components/Provider';

export const metadata = {
  title: 'Flapie - Share Your Culinary Journey',
  description: 'Discover, create, and share amazing recipes with the world. Join Flapie\'s community of food enthusiasts.',
  icons: {
    icon: '/assets/images/logo.png',
  },
};

const RootLayout = ({children}) => {
  return (
    <html lang="en">
      <body>
        <Provider>
          <div className='main'>
            <div className="gradient"/>
          </div>
          <main className="app">
            <Nav/>
            {children}
          </main>
        </Provider>
      </body>
    </html>
  )
}

export default RootLayout