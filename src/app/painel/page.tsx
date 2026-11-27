import styles from '@/_styles/cssUserPanelPage/UserPanel.module.css'


export default function UserPanelPage() {
  return(
    <main className={styles.container_main}>
        <h1 className={styles.title}>Boas-vindas ao seu painel!</h1>
        <p>Escolha uma opção no menu lateral para começar. Selecione uma seção para gerenciar sua conta, explorar seus produtos ou acessar os recursos disponíveis.</p>
    </main>
  )
}