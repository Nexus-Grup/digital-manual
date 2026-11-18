import styles from '@/_styles/cssUserPanelPage/UserPanel.module.css'


export default function UserPanelPage() {
  return(
    <main className={styles.container_main}>
        <h1 className={styles.title}>Welcome to your User Panel!</h1>
        <p>Select an option from the sidebar menu to get started. Choose a section to manage your account, explore your products, or access your available features.</p>
    </main>
  )
}