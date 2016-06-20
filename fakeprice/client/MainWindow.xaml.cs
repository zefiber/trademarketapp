using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace client
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        AsynchronousClient ac = null;
        public MainWindow()
        {
            InitializeComponent();
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
            if (ac != null)
            {
                ac.Close();
            }
            ac = new AsynchronousClient(m_ip.Text, Convert.ToInt32(m_port.Text), this,m_user.Text, this.m_pass.Text);
        }

        private void Button_Click_1(object sender, RoutedEventArgs e)
        {
            ac.subscribe(m_symbol.Text);
        }

        private void Button_Click_2(object sender, RoutedEventArgs e)
        {
            ac.unsubscribe(m_symbol.Text);
        }


        public void SetSendData(string data)
        {
            Dispatcher.BeginInvoke((Action)(() => { this.m_sendlog.Text = data; }));
            
        }


        public void SetGridData(List<DataFeed> list ,string ret)
        {
            Dispatcher.BeginInvoke((Action)(() => { m_grid.ItemsSource = list; m_receivelog.Text = ret; }));
        }

    }
}
